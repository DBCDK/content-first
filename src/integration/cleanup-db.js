'use strict';

/**
 * Database manipulation for use when testing.
 *
 * Use like this in *_test.js files:
 * const dbUtil = require('cleanup-db')(knex);
 */

const constants = require('server/constants')();
const table = constants.table;

module.exports = knex => {

  /**
   * Truncate all tables in the current database.
   */
  function clear() {
    return knex.raw(`truncate table ${table} cascade`);
  }

  /**
   * Completely clean up the database and migrations.
   */
  function dropAll() {
    return knex.schema.dropTableIfExists(table)
      .then(() => {
        return knex.schema.dropTableIfExists('knex_migrations');
      })
      .then(() => {
        return knex.schema.dropTableIfExists('knex_migrations_lock');
      });
  }

  return {
    clear,
    dropAll
  };
};
