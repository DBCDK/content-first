'use strict';

const config = require('server/config');
const logger = require('__/logging')(config.logger);
const request = require('superagent');
const uuidv4 = require('uuid/v4');
const {validatingInput} = require('server/json-verifiers');

/**
 * Authentication for OpenPlatform via Smaug.
 */
class Authenticator {
  constructor () {
    this.ok = true;
    this.currentError = null;
    this.errors = [];
    this.token = null;
    this.msEpochExpire = Date.now();
  }
  isOk () {
    return this.ok;
  }
  setOk () {
    this.ok = true;
  }
  getCurrentError () {
    if (this.isOk()) {
      return null;
    }
    return this.currentError;
  }
  getErrorLog () {
    return this.errors;
  }
  logError (error) {
    logger.log.error('Error retrieving authentication token', error);
    this.currentError = 'Authentication service (Smaug) probably unreachable';
    this.errors.push(
      (new Date()).toISOString() + ': ' + error
    );
    this.ok = false;
    this.token = null;
  }
  testingConnection () {
    const me = this;
    return new Promise((resolve, reject) => {
      if (config.auth.url !== 'https://auth.exists.not') {
        me.setOk();
        return resolve(me.isOk());
      }
      logger.log.trace('not implemented');
      me.logError('not implemented');
      reject(me.isOk());
    });
  }
  gettingToken () {
    const me = this;
    return new Promise((resolve, reject) => {
      if (this.tokenWillSoonExpire()) {
        return me.requiringNewToken()
          .then(resolve)
          .catch(reject);
      }
      resolve(this.token);
    });
  }
  tokenWillSoonExpire () {
    const msEpochTomorrow = Date.now() + (1000 * 60 * 60 * 24);
    return (this.msEpochExpire < msEpochTomorrow);
  }
  requiringNewToken () {
    const me = this;
    return request.post(`${config.auth.url}/oauth/token`)
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
          throw data;
        }
        return data;
      })
      .then(data => {
        return validatingInput(data, 'schemas/authentication-in.json');
      })
      .then(document => {
        me.token = document.access_token;
        me.msEpochExpire = (Date.now() + document.expires_in * 1000);
        me.setOk();
        return me.token;
      })
      .catch(error => {
        me.logError(error);
      });
  }
}
const authenticator = new Authenticator();

module.exports = authenticator;
