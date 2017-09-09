'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;

exports.up = function(knex) {
  return knex.schema.table(bookTable, table => {
    table.string('items');
    table.string('libraries');
  });
};

exports.down = function(knex) {
  return knex.schema.table(bookTable, table => {
    table.dropColumn('items');
    table.dropColumn('libraries');
  });
};
