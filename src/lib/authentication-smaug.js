'use strict';

const config = require('server/config');
const request = require('superagent');
const _ = require('lodash');
const path = require('path');
const schemaNewToken = path.join(__dirname, 'schemas/authenticator-token-in.json');
const schemaHealth = path.join(__dirname, 'schemas/authenticator-health-in.json');
const {validating} = require('__/json');

/**
 * Authentication for OpenPlatform via Smaug.
 */
class Authenticator {
  //
  // Public methods.
  //
  constructor () {
    this.clear();
  }
  clear () {
    this.setOk();
    this.errorLog = [];
    this.token = null;
    this.ms_EpochExpire = Date.now();
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
      request.get(`${config.auth.url}/health`)
        .then(response => {
          return response.body;
        })
        .then(validating(schemaHealth))
        .then(data => {
          const ok = _.every(_.values(data), status => status === 'ok');
          if (ok) {
            me.setOk();
          }
          else {
            me.logError(`Authentication service is unhealthy: ${JSON.stringify(data)}`);
          }
          return resolve(me.isOk());
        })
        .catch(error => {
          if (error.status === 500) {
            me.logError('Authentication service is unhealthy');
          }
          else {
            me.logError(error);
          }
          return resolve(me.isOk());
        });
    });
  }
  gettingToken () {
    this.setOk();
    return new Promise((resolve, reject) => {
      if (!this.tokenWillSoonExpire() && this.token) {
        return resolve(this.token);
      }
      const me = this;
      request.post(`${config.auth.url}/oauth/token`)
        .type('form')
        .send({
          grant_type: 'password',
          username: '@',
          password: '@'
        })
        .auth(config.auth.id, config.auth.secret)
        .then(response => {
          const data = response.body;
          if (data.error) {
            throw new Error(data.error);
          }
          return data;
        })
        .then(validating(schemaNewToken))
        .then(data => {
          const ms_ExpiresIn = data.expires_in * 1000;
          return resolve(me.setToken(data.access_token, ms_ExpiresIn));
        })
        .catch(error => {
          me.logError(error);
          reject(error);
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
  setToken (token, ms_ExpiresIn) {
    this.token = token;
    this.ms_EpochExpire = Date.now() + ms_ExpiresIn;
    return this.token;
  }
  logError (error) {
    this.ok = false;
    this.currentError = 'Authentication-service communication failed';
    let logEntry = JSON.stringify(error);
    if (logEntry === '{}') {
      logEntry = error.toString();
    }
    this.errorLog.push(
      (new Date()).toISOString() + ': ' + logEntry
    );
  }
  tokenWillSoonExpire () {
    const msEpochTomorrow = Date.now() + (24 * 60 * 60 * 1000);
    return (this.ms_EpochExpire < msEpochTomorrow);
  }
}

module.exports = Authenticator;
