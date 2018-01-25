'use strict';

const request = require('superagent');
const _ = require('lodash');
const path = require('path');
const schemaUserInfo = path.join(__dirname, 'login-user-info-in.json');
const schemaHealth = path.join(__dirname, 'login-health-in.json');
const constants = require('./login-constants')();
const {validatingInput} = require('__/json');

/**
 * Login for Adgangsplatform via Hejmdal.
 */

class Login {
  //
  // Public methods.
  //

  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'hejmdal';
  }

  clear() {
    this.setOk();
    this.errorLog = [];
  }

  isOk() {
    return this.ok;
  }

  getCurrentError() {
    return this.currentError;
  }

  getErrorLog() {
    return this.errorLog;
  }

  testingConnection() {
    return new Promise(resolve => {
      const me = this;
      request
        .get(`${me.config.url}${constants.apiHealth}`)
        .set('accept', 'application/json')
        .then(response => {
          return response.body;
        })
        .then(body => {
          me.logger.log.debug(`Validating ${JSON.stringify(body)}`);
          return validatingInput(body, schemaHealth);
        })
        .then(data => {
          const ok = _.every(_.values(data), service => service.state === 'ok');
          if (ok) {
            me.setOk();
          } else {
            me.logError(`Login service is unhealthy: ${JSON.stringify(data)}`);
          }
          return resolve(me.isOk());
        })
        .catch(error => {
          if (error.status === 500) {
            me.logError('Login service is unhealthy');
          } else {
            me.logError(error);
          }
          return resolve(me.isOk());
        });
    });
  }

  gettingTicket(token, id) {
    this.setOk();
    const me = this;
    return new Promise(async (resolve, reject) => {
      const url = `${me.config.url}${constants.apiGetTicket}/${token}/${id}`;
      me.logger.log.debug(`Getting login info from ${url}`);
      try {
        const response = await request
          .get(url)
          .set('accept', 'application/json');
        const body = me.extractBodyAsJson(response);
        if (!body.attributes) {
          return reject(new Error('No login information received'));
        }
        me.logger.log.debug('Validating', body);
        await validatingInput(body, schemaUserInfo);
        const attr = body.attributes;
        if (!attr || !attr.authenticatedToken) {
          return reject(
            new Error(`No Openplatform token in ${JSON.stringify(body)}`)
          );
        }
        const openplatformToken = attr.authenticatedToken;
        const apiGetUser = constants.apiGetUserIdByToken(openplatformToken);
        const getUser = `${me.config.openplatformUrl}${apiGetUser}`;
        me.logger.log.debug(`Getting user info from ${getUser}`);
        const response2 = await request
          .get(getUser)
          .set('accept', 'application/json');
        const openplatformUser = me.extractBodyAsJson(response2);
        const openplatformId = openplatformUser.data.id;
        return resolve({openplatformToken, openplatformId});
      } catch (error) {
        me.logger.log.debug('Caught', error);
        me.logError(error);
        return reject(new Error(error));
      }
    });
  }

  //
  // Private methods.
  //

  extractBodyAsJson(response) {
    if (_.isEmpty(response.body)) {
      return JSON.parse(response.text);
    }
    return response.body;
  }

  setOk() {
    this.ok = true;
    this.currentError = null;
  }

  logError(error) {
    this.ok = false;
    this.currentError = 'Login-service communication failed';
    let logEntry = JSON.stringify(error);
    if (logEntry === '{}') {
      logEntry = error.toString();
    }
    this.errorLog.push(new Date().toISOString() + ': ' + logEntry);
  }
}

module.exports = Login;
