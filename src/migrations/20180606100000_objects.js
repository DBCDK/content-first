'use strict';

const constants = require('server/constants')();
const objectsTable = constants.objects.table;

exports.up = function(knex) {
  return knex.schema.createTable(objectsTable, table => {
    table.uuid('id').primary();
    table.string('rev').notNullable();
    table.string('owner').notNullable();
    table.string('type').notNullable();
    table.string('key').notNullable();
    table.boolean('public').notNullable();
    table.integer('created').notNullable();
    // seconds since 1970
    table.integer('modified').notNullable();
    table.json('data').notNullable();
    table.index(['type', 'key', 'modified']);
    table.index(['owner', 'type', 'key', 'modified']);
  });
};

exports.down = function() {
  return Promise.resolve();
};
