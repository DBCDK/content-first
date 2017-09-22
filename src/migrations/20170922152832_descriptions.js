'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;

exports.up = function(knex) {
  return knex.schema.table(bookTable, table => {
    table.dropColumn('description');
    table.text('taxonomy_description');
    table.text('bibliographic_description');
  });
};

exports.down = function(knex) {
  return knex.schema.table(bookTable, table => {
    table.text('description');
    table.dropColumn('taxonomy_description');
    table.dropColumn('bibliographic_description');
  });
};
