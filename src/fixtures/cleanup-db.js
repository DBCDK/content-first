'use strict';

/**
 * Database manipulation for use when testing.
 *
 * Use like this in *_test.js files:
 * const dbUtil = require('cleanup-db')(knex);
 * beforeEach(async () => {
 *   await dbUtil.clear();
 *   await knex.seed.run();
 * });
 */

const constants = require('server/constants')();
const bookTable = constants.books.table;
const cookieTable = constants.cookies.table;
const coverTable = constants.covers.table;
const listTable = constants.lists.table;
const tagTable = constants.tags.table;
const taxonomyBottomTable = constants.taxonomy.bottomTable;
const taxonomyMiddleTable = constants.taxonomy.middleTable;
const taxonomyTopTable = constants.taxonomy.topTable;

module.exports = knex => {
  /**
   * Truncate all tables in the current database.
   */
  function clear() {
    const tables = [
      bookTable,
      cookieTable,
      coverTable,
      listTable,
      tagTable,
      taxonomyBottomTable,
      taxonomyMiddleTable,
      taxonomyTopTable
    ];
    return knex.raw(`truncate table ${tables.join()} cascade`);
  }

  return {
    clear
  };
};
