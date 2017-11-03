'use strict';

const config = require('server/config');
const knex = require('knex')(config.db);
const Database = require('__/service/database');
const database = new Database(knex);

/*
 * Make sure database is at most recent schema.
 */
const logger = require('server/logger');
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
