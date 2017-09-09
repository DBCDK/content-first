/**
 * The initial database setup.
 */

'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;
const coverTable = constants.covers.table;

function createBookTable(knex) {
  return knex.schema.createTable(bookTable, table => {
    table.string('pid').primary();
    table.string('unit_id');
    table.string('work_id');
    table.integer('bibliographic_record_id');
    table.string('creator');
    table.string('title');
    table.string('title_full');
    table.text('description');
    table.integer('pages');
    table.integer('published_year');
    table.integer('published_month');
    table.integer('published_day');
    table.integer('loan_count');
    table.integer('inventory');
    table.integer('purchased');
    table.string('type');
    table.string('work_type');
    table.string('language');
  });
}

function createCoverTable(knex) {
  return knex.schema.createTable(coverTable, table => {
    table.string('pid').primary();
    table.binary('image');
  });
}

function setup(knex) {
  return createCoverTable(knex)
    .then(() => {
      return createBookTable(knex);
    });
}

function destroy(knex) {
  return knex.schema.dropTableIfExists(bookTable)
    .then(() => {
      return knex.schema.dropTableIfExists(coverTable);
    });
}

exports.up = function(knex) {
  return setup(knex);
};

exports.down = function(knex) {
  return destroy(knex);
};
