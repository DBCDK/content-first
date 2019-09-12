'use strict';

const config = require('server/config');
const knex = require('knex')(config.db);
const Database = require('__/services/database');
const database = new Database(knex);

/*
 * Make sure database is at most recent schema.
 */
const logger = require('server/logger');
function migrate() {
  knex.migrate
    .latest()
    .then(() => {
      logger.log.debug('Database is now at latest version.');
      database.setOk();
    })
    .catch(error => {
      const delay = 2000;
      logger.log.info(
        `Could not update database to latest version: ${error}, will retry ${delay}ms`
      );
      database.logError(error);
      setTimeout(migrate, delay);
    });
}
migrate();

module.exports = database;
