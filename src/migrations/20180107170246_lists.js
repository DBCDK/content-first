'use strict';

const constants = require('server/constants')();
const listTable = constants.lists.table;

exports.up = function(knex) {
  return knex.schema.createTable(listTable, table => {
    table.uuid('uuid').primary();
    table.integer('community_profile_id').notNullable();
    table.integer('community_entity_id').nullable();
  });
};

exports.down = function() {
  return Promise.resolve();
};
