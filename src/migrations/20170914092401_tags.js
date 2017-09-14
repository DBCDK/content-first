'use strict';

const constants = require('server/constants')();
const tagTable = constants.tags.table;

exports.up = function(knex) {
  return knex.schema.createTable(tagTable, table => {
    table.string('pid');
    table.integer('tag');
    table.unique(['pid', 'tag']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists(tagTable);
};
