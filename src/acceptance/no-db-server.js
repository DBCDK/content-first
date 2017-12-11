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
  constructor () {
    this.errorLog = null;
    this.infoLog = null;
    this.server = require('server/external-server');
  }
  getErrorLog () {
    return this.errorLog;
  }
  beforeEach () {
    this.errorLog = sinon.stub(logger.log, 'error');
    this.infoLog = sinon.stub(logger.log, 'info');
  }
  afterEach () {
    this.errorLog.restore();
    this.infoLog.restore();
  }
}

module.exports = new MockServer();
