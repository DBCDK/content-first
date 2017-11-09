'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;

exports.up = function(knex) {
  return knex.schema.table(bookTable, table => {
    table.dropColumn('bibliographic_description');
    table.dropColumn('loan_count');
    table.text('description');
    table.integer('loans');
  });
};

exports.down = function() {
  return Promise.resolve();
};
