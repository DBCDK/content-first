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
  async function dropAll () {
    await knex.schema.dropTableIfExists(coverTable);
    await knex.schema.dropTableIfExists(bookTable);
    await knex.schema.dropTableIfExists('knex_migrations');
    await knex.schema.dropTableIfExists('knex_migrations_lock');
  }

  return {
    clear,
    dropAll
  };
};
