'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;

exports.up = function(knex) {
  return knex.schema.table(bookTable, table => {
    table.dropColumn('published_year');
    table.dropColumn('published_month');
    table.dropColumn('published_day');
    table.string('subject');
    table.string('genre');
    table.integer('first_edition_year').defaultTo(0);
    table.string('literary_form');
  });
};

exports.down = function(knex) {
  return knex.schema.table(bookTable, table => {
    table.integer('published_year');
    table.integer('published_month');
    table.integer('published_day');
    table.dropColumn('subject');
    table.dropColumn('genre');
    table.dropColumn('first_edition_year');
    table.dropColumn('literary_form');
  });
};
