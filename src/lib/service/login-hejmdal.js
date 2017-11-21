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
  constructor (config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }
  getName () {
    return 'hejmdal';
  }
  clear () {
    this.setOk();
    this.errorLog = [];
  }
  isOk () {
    return this.ok;
  }
  getCurrentError () {
    return this.currentError;
  }
  getErrorLog () {
    return this.errorLog;
  }
  testingConnection () {
    return new Promise(resolve => {
      const me = this;
      request.get(`${me.config.url}${constants.apiHealth}`)
        .set('accept', 'application/json')
        .then(response => {
          return response.body;
        })
        .then(body => {
          me.logger.log.info(`Validating ${JSON.stringify(body)}`);
          return validatingInput(body, schemaHealth);
        })
        .then(data => {
          const ok = _.every(_.values(data), service => service.state === 'ok');
          if (ok) {
            me.setOk();
          }
          else {
            me.logError(`Login service is unhealthy: ${JSON.stringify(data)}`);
          }
          return resolve(me.isOk());
        })
        .catch(error => {
          if (error.status === 500) {
            me.logError('Login service is unhealthy');
          }
          else {
            me.logError(error);
          }
          return resolve(me.isOk());
        });
    });
  }
  gettingTicket (token, id) {
    this.setOk();
    const me = this;
    return new Promise((resolve, reject) => {
      const url = `${me.config.url}${constants.apiGetTicket}/${token}/${id}`;
      me.logger.log.info(`Getting user info from ${url}`);
      request.get(url)
        .set('accept', 'application/json')
        .then(response => {
          if (_.isEmpty(response.body)) {
            return JSON.parse(response.text);
          }
          return response.body;
        })
        .then(data => {
          if (!data.attributes) {
            return reject(new Error('No user information received'));
          }
          me.logger.log.info('Validating', data);
          return validatingInput(data, schemaUserInfo);
        })
        .then(data => {
          const attr = data.attributes;
          if (attr) {
            return resolve({
              cpr: attr.cpr,
              gender: attr.gender ? attr.gender : null,
              userId: attr.userId,
              wayfId: attr.wayfId,
              uniloginId: attr.uniloginId ? attr.uniloginId : null,
              agencies: attr.agencies,
              municipality: attr.municipality ? attr.municipality : null,
              birthDate: attr.birthDate ? attr.birthDate : null,
              birthYear: attr.birthYear ? parseInt(attr.birthYear, 10) : null
            });
          }
          return reject(new Error(`User information could not be retrieved from ${JSON.stringify(data)}`));
        })
        .catch(error => {
          me.logger.log.info('Caught', error);
          me.logError(error);
          return reject(new Error(error));
        });
    });
  }
  //
  // Private methods.
  //
  setOk () {
    this.ok = true;
    this.currentError = null;
  }
  logError (error) {
    this.ok = false;
    this.currentError = 'Login-service communication failed';
    let logEntry = JSON.stringify(error);
    if (logEntry === '{}') {
      logEntry = error.toString();
    }
    this.errorLog.push(
      (new Date()).toISOString() + ': ' + logEntry
    );
  }
}

module.exports = Login;
