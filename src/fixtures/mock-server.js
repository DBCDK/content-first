'use strict';

/**
 * A mock server that silences the global logger and provides functions
 * resetting() and dumpLogs() that can be used in the tests like
 *
 *.   beforeEach(async () => {
 *.     await mock.resetting();
 *.   });
 *.   afterEach(function () {
 *.     if (this.currentTest.state !== 'passed') {
 *.       mock.dumpLogs();
 *.     }
 *.   });
 */

const logger = require('server/logger');
const sinon = require('sinon');
const config = require('server/config');
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);

class MockServer {

  constructor () {
    this.setupWellKnownSaltForHashing();
    this.setupStubsForLogging();
    this.setupWebServices();
  }

  setupStubsForLogging () {
    this.errorLog = sinon.stub(logger.log, 'error');
    this.infoLog = sinon.stub(logger.log, 'info');
    this.debugLog = sinon.stub(logger.log, 'debug');
  }

  setupWebServices () {
    this.external = require('server/external-server');
    this.internal = require('server/internal-server');
  }

  setupWellKnownSaltForHashing () {
    config.login.salt = 'and-a-tiny-bit-of-salt';
  }

  async resetting () {
    this.resetLogs();
    await dbUtil.clear();
    await knex.seed.run();
  }

  getErrorLog () {
    return this.errorLog;
  }

  resetLogs () {
    this.errorLog.reset();
    this.infoLog.reset();
    this.debugLog.reset();
  }

  dumpLogs () {
    const _ = require('lodash');
    const allLogCalls = _.concat(this.debugLog.getCalls(), this.infoLog.getCalls(), this.errorLog.getCalls());
    const logs = _.map(allLogCalls, call => call.args);
    const util = require('util');
    console.log(util.inspect(logs, {depth: 3})); // eslint-disable-line no-console
  }
}

module.exports = new MockServer();
