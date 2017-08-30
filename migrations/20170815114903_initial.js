'use strict';

/**
 * The initial database setup.
 */

const constants = require('server/constants')();
const booksTable = constants.books.table;

function createBooksTable(knex) {
  return knex.schema.createTable(booksTable, table => {
    table.string('pid').primary();
    table.string('unit_id');
    table.string('work_id');
    table.integer('bibliographic_record_id');
    table.string('creator');
    table.string('title');
    table.string('title_full');
    table.text('description');
    table.integer('pages');
    table.integer('loan_count');
    table.integer('inventory');
    table.integer('purchased');
    table.string('type');
    table.string('work_type');
    table.string('language');
    table.blob('cover');
    table.jsonb('attributes').notNullable().defaultTo('{}');
  });
}

function setup(knex) {
  return createBooksTable(knex);
}

function destroy(knex) {
  return knex.schema.dropTableIfExists(booksTable);
}

exports.up = function(knex) {
  return setup(knex);
};

exports.down = function(knex) {
  return destroy(knex);
};
