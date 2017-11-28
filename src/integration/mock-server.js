'use strict';

/**
 * A mock server that silences the global logger and provides beforeEach and
 * afterEach functions that can be called in tests to seed the database.
 */

const logger = require('server/logger');
const sinon = require('sinon');
const config = require('server/config');
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);

class MockServer {
  constructor () {
    // Make sure the cpr hash salt is known.
    config.login.salt = 'something';
    this.errorLog = null;
    this.infoLog = null;
    this.external = require('server/external-server');
    this.internal = require('server/internal-server');
  }
  getErrorLog () {
    return this.errorLog;
  }
  getInfoLog () {
    return this.infoLog;
  }
  async beforeEach () {
    this.errorLog = sinon.stub(logger.log, 'error');
    this.infoLog = sinon.stub(logger.log, 'info');
    await dbUtil.clear();
    await knex.seed.run();
  }
  afterEach () {
    this.errorLog.restore();
    this.infoLog.restore();
  }
}

module.exports = new MockServer();
