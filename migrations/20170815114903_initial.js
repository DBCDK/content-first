'use strict';

/**
 * The initial database setup.
 */

const constants = require('server/constants')();
const dummyTable = constants.table;

function createDummyTable(knex) {
  return knex.schema.createTable(dummyTable, table => {
    table.increments('id').primary();
    table.string('name').unique();
  });
}

function setup(knex) {
  return createDummyTable(knex);
}

function destroy(knex) {
  return knex.schema.dropTableIfExists(dummyTable);
}

exports.up = function(knex) {
  return setup(knex);
};

exports.down = function(knex) {
  return destroy(knex);
};
