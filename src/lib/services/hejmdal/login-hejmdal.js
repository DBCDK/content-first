'use strict';

const request = require('superagent');
const _ = require('lodash');
const {pbkdf2} = require('crypto');
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
        me.logger.log.debug(`Validating ${JSON.stringify(body)}`);
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
      me.logger.log.debug(`Getting user info from ${url}`);
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
        me.logger.log.debug('Validating', data);
        return validatingInput(data, schemaUserInfo);
      })
      .then(data => {
        const attr = data.attributes;
        if (attr) {
          return Promise.all([
            me.calculatingHash(attr.cpr),
            me.calculatingHash(attr.userId)
          ]);
        }
        return reject(new Error(`User information could not be retrieved from ${JSON.stringify(data)}`));
      })
      .then(hashedCprAndUserId => {
        return resolve({
          cprHash: hashedCprAndUserId[0].toString('hex'),
          userIdHash: hashedCprAndUserId[1].toString('hex')
        });
      })
      .catch(error => {
        me.logger.log.debug('Caught', error);
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

  calculatingHash (data) {
    const iterations = 10000;
    const hashLength = 24;
    const salt = this.config.salt;
    return new Promise((resolve, reject) => {
      pbkdf2(data, salt, iterations, hashLength, 'sha512', (error, hash) => {
        if (error) {
          return reject(error);
        }
        resolve(hash);
      });
    });
  }
}

module.exports = Login;
