'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.createTable(userTable, table => {
    table.string('uuid').primary();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists(userTable);
};
