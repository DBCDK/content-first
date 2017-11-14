'use strict';
const _ = require('lodash');

/**
 * Generate object that described the health of subservices.
 * @param  {[services]} services List of subservices.
 * @return {{ok, services}}      Status object.
 */
async function generatingServiceStatus (services) {
  const servicesHealth = await Promise.all(
    _.map(services, service => {
      const name = service.getName();
      return service.testingConnection()
      .then(status => {
        if (status) {
          return {
            service: name,
            ok: status
          };
        }
        return {
          service: name,
          ok: status,
          problem: service.getCurrentError()
        };
      })
      .catch(error => {
        return {
          service: name,
          ok: false,
          problem: error
        };
      });
    })
  );
  const ok = _.every(servicesHealth, health => health.ok);
  if (ok) {
    return {
      ok: true,
      services: servicesHealth
    };
  }
  // Find all services that erred.
  const erred = _.filter(services, service => !service.isOk());
  return {
    ok: false,
    services: servicesHealth,
    errorText: _.join(_.map(erred, service => service.getCurrentError())),
    errorLog: _.flatMap(erred, service => service.getErrorLog())
  };
}

module.exports = generatingServiceStatus;
