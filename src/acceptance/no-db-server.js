'use strict';

/**
 * A mock server that simulates a non-reachable database, silences the global
 * logger and provides beforeEach and afterEach functions that can be called
 * in tests to seed the database.
 */

process.env.PORT = 5640;
process.env.DB_HOST = 'db.exists.not';

const logger = require('server/logger');
const sinon = require('sinon');

class MockServer {
  constructor() {
    this.setupStubsForLogging();
    this.setupWebServices();
  }

  setupStubsForLogging() {
    this.errorLog = sinon.stub(logger.log, 'error');
    this.infoLog = sinon.stub(logger.log, 'info');
    this.debugLog = sinon.stub(logger.log, 'debug');
  }

  setupWebServices() {
    this.server = require('server/external-server');
  }

  getErrorLog() {
    return this.errorLog;
  }

  getInfoLog() {
    return this.infoLog;
  }

  beforeEach() {
    this.resetLogs();
  }

  resetLogs() {
    this.errorLog.reset();
    this.infoLog.reset();
    this.debugLog.reset();
  }

  dumpLogs() {
    const _ = require('lodash');
    const allLogCalls = _.concat(
      this.debugLog.getCalls(),
      this.infoLog.getCalls(),
      this.errorLog.getCalls()
    );
    const logs = _.map(allLogCalls, call => call.args);
    const util = require('util');
    console.log(util.inspect(logs, {depth: null})); // eslint-disable-line no-console
  }
}

module.exports = new MockServer();
