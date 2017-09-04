'use strict';

/**
 * Database manipulation for use when testing.
 *
 * Use like this in *_test.js files:
 * const dbUtil = require('cleanup-db')(knex);
 */

const constants = require('server/constants')();
const bookTable = constants.books.table;
const coverTable = constants.covers.table;

module.exports = knex => {

  /**
   * Truncate all tables in the current database.
   */
  function clear() {
    return knex.raw(`truncate table ${bookTable}, ${coverTable} cascade`);
  }

  /**
   * Completely clean up the database and migrations.
   */
  function dropAll() {
    return knex.schema.dropTableIfExists(coverTable)
      .then(() => {
        return knex.schema.dropTableIfExists(bookTable);
      })
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
