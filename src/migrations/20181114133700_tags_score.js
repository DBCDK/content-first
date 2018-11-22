'use strict';

const constants = require('server/constants')();
const tagTable = constants.tags.table;

exports.up = function(knex) {
  return knex.schema.table(tagTable, table => {
    table.decimal('score').defaultTo(1);
  });
};

exports.down = function(knex) {
  return knex.schema.table(tagTable, table => {
    table.dropColumn('score');
  });
};
