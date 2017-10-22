'use strict';

const config = require('server/config');
// const logger = require('__/logging')(config.logger);
const request = require('superagent');
// const uuidv4 = require('uuid/v4');
const path = require('path');
const schema = path.join(__dirname, 'schemas/authenticator-in.json');
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
    this.ok = true;
    this.token = null;
    this.ms_EpochExpire = Date.now();
  }
  isOk () {
    return this.ok;
  }
  getCurrentError () {
  }
  getErrorLog () {
  }
  testingConnection () {
  }
  gettingToken () {
    if (!this.tokenWillSoonExpire() && this.token) {
      return this.token;
    }
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
          throw new Error(data);
        }
        return data;
      })
      .then(validating(schema))
      .then(data => {
        const ms_ExpiresIn = data.expires_in * 1000;
        return me.setToken(data.access_token, ms_ExpiresIn);
      });
  }
  //
  // Private methods.
  //
  setToken (token, ms_ExpiresIn) {
    this.token = token;
    this.ms_EpochExpire = Date.now() + ms_ExpiresIn;
    return this.token;
  }
  logError (error) {
  }
  tokenWillSoonExpire () {
    const msEpochTomorrow = Date.now() + (24 * 60 * 60 * 1000);
    return (this.ms_EpochExpire < msEpochTomorrow);
  }
}

module.exports = Authenticator;
