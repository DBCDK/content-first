'use strict';
const config = require('server/config');
const logger = require('__/logging')(config.logger);

/**
 * Database error accounting.
 */
class Database {
  constructor () {
    this.ok = true;
    this.currentError = null;
    this.databaseErrors = [];
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
    return this.databaseErrors;
  }
  logError (error) {
    this.currentError = 'Database probably unreachable';
    this.databaseErrors.push(
      (new Date()).toISOString() + ': ' + error
    );
    this.ok = false;
  }
  testingConnection () {
    // Make a dummy query.
    return knex.raw('select 1+1 as result')
      .then(function () {
        logger.log.trace('There is a valid connection in the pool');
        database.setOk();
        return database.isOk();
      })
      .catch(error => {
        logger.log.trace('problem connecting');
        database.logError(error);
        return database.isOk();
      });
  }
}
const database = new Database();

/*
 * Make sure database is at most recent schema.
 */
const knex = require('knex')(config.db);
knex.migrate.latest()
  .then(() => {
    logger.log.debug('Database is now at latest version.');
    database.setOk();
  })
  .catch(error => {
    logger.log.info(`Could not update database to latest version: ${error}`);
    database.logError(error);
  });

module.exports = database;
