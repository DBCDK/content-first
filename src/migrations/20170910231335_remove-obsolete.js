'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;

exports.up = function(knex) {
  return knex.schema
    .table(bookTable, table => {
      table.dropColumn('purchased');
      table.dropColumn('inventory');
      table.dropColumn('items');
      table.dropColumn('libraries');
    })
    .then(() => {
      return knex.schema.table(bookTable, table => {
        table.integer('items');
        table.integer('libraries');
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .table(bookTable, table => {
      table.integer('inventory');
      table.integer('purchased');
      table.dropColumn('items');
      table.dropColumn('libraries');
    })
    .then(() => {
      return knex.schema.table(bookTable, table => {
        table.string('items');
        table.string('libraries');
      });
    });
};
