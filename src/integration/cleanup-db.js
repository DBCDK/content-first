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
const tagTable = constants.tags.table;
const taxonomyTopTable = constants.taxonomy.topTable;
const taxonomyMiddleTable = constants.taxonomy.middleTable;
const taxonomyBottomTable = constants.taxonomy.bottomTable;
const userTable = constants.users.table;

module.exports = knex => {

  /**
   * Truncate all tables in the current database.
   */
  function clear() {
    return knex.raw(`truncate table ${userTable}, ${tagTable}, ${taxonomyBottomTable}, ${taxonomyMiddleTable}, ${taxonomyTopTable}, ${bookTable}, ${coverTable} cascade`);
  }

  return {
    clear
  };
};
