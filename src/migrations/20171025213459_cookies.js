'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;
const cookieTable = constants.cookies.table;

exports.up = function(knex) {
  return knex.schema.createTable(cookieTable, table => {
    table.string('uuid').primary();
    table.string('user').notNullable();
    table.foreign('user').references(`${userTable}.uuid`);
    table.integer('expires_epoch_s').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists(cookieTable);
};
