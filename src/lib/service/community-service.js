'use strict';

const request = require('superagent');
const path = require('path');
const schemaHealth = path.join(__dirname, 'community-service-health-in.json');
const constants = require('./community-service-constants')();
const {validating} = require('__/json');

/**
 * Community Service (Elvis).
 */
class Community {
  //
  // Public methods.
  //
  constructor (config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }
  getName () {
    return 'elvis';
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
        if (data.ok) {
          me.setOk();
        }
        else {
          me.logError(`Community service is unhealthy: ${JSON.stringify(data)}`);
        }
        return resolve(me.isOk());
      })
      .catch(error => {
        if (error.status === 500) {
          me.logError('Community service is unhealthy');
        }
        else {
          me.logError(error);
        }
        return resolve(me.isOk());
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
    this.currentError = 'Community-service communication failed';
    let logEntry = JSON.stringify(error);
    if (logEntry === '{}') {
      logEntry = error.toString();
    }
    this.errorLog.push(
      (new Date()).toISOString() + ': ' + logEntry
    );
  }
}

module.exports = Community;
