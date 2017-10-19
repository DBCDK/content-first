'use strict';

const config = require('server/config');
const logger = require('__/logging')(config.logger);

/**
 * Authentication for OpenPlatform via Smaug.
 */
class Authenticator {
  constructor () {
    this.ok = true;
    this.currentError = null;
    this.errors = [];
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
    this.currentError = 'Authentication service (Smaug) probably unreachable';
    this.errors.push(
      (new Date()).toISOString() + ': ' + error
    );
    this.ok = false;
  }
  testingConnection () {
    logger.log.trace('not implemented');
    this.logError('not implemented');
    return this.isOk();
  }
}

module.exports = Authenticator;
