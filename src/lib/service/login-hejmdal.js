'use strict';

const request = require('superagent');
const _ = require('lodash');
const path = require('path');
const schemaUserInfo = path.join(__dirname, 'login-user-info-in.json');
const schemaHealth = path.join(__dirname, 'login-health-in.json');
const constants = require('./login-constants')();
const {validating} = require('__/json');

/**
 * Login for Adgangsplatform via Hejmdal.
 */
class Login {
  //
  // Public methods.
  //
  constructor (config) {
    this.config = config;
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
        .then(response => {
          return response.body;
        })
        .then(validating(schemaHealth))
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
    return new Promise((resolve, reject) => {
      const me = this;
      const url = `${me.config.url}${constants.apiGetTicket}/${token}/${id}`;
      request.get(url)
        .then(response => {
          return response.body;
        })
        .then(validating(schemaUserInfo))
        .then(data => {
          const attr = data.attributes;
          if (attr) {
            return resolve({
              cpr: attr.cpr,
              gender: attr.gender,
              userId: attr.userId,
              wayfId: attr.wayfId,
              uniloginId: attr.uniloginId,
              agencies: attr.agencies,
              municipality: attr.municipality,
              birthDate: attr.birthDate,
              birthYear: parseInt(attr.birthYear, 10)
            });
          }
          return reject(new Error('User information could not be retrieved'));
        })
        .catch(error => {
          this.logError(error);
          return reject(error);
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
