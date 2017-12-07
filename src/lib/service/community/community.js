'use strict';

const request = require('superagent');
const path = require('path');
const schemaHealth = path.join(__dirname, 'community-health-in.json');
const schemaCommunity = path.join(__dirname, 'community-community-in.json');
const constants = require('./community-constants')();
const {validating, validatingInput} = require('__/json');

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
    this.communityId = null;
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
        me.interpretAndLogResponseError(error);
        return resolve(me.isOk());
      });
    });
  }

  gettingCommunityId () {
    if (this.communityId) {
      return Promise.resolve(this.communityId);
    }
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request.get(me.getCommunityNameUrl());
        await validatingInput(response.body, schemaCommunity);
        const data = response.body.data;
        return resolve(me.setCommunityId(data[0].id));
      }
      catch (error) {
        if (error.status !== 404) {
          me.interpretAndLogResponseError(error);
          return reject(error);
        }
        await me.creatingCommunity();
        return resolve(me.communityId);
      }
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

  interpretAndLogResponseError (error) {
    if (error.status >= 500) {
      this.logError('Community service is unhealthy');
    }
    else {
      this.logError(error);
    }
  }

  getCommunityNameUrl () {
    return `${this.config.url}${constants.apiCommunity}/${constants.communityName}`;
  }

  creatingCommunity () {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request
          .post(`${me.config.url}${constants.apiCommunity}`)
          .send({name: constants.communityName});
        await validatingInput(response.body, schemaCommunity);
        me.setCommunityId(response.body.data[0].id);
        return resolve(me.communityId);
      }
      catch (error) {
        return reject(error);
      }
    });
  }

  setCommunityId (id) {
    this.communityId = parseInt(id, 10);
    return this.communityId;
  }
}

module.exports = Community;
