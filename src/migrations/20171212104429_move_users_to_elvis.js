'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;
const cookieTable = constants.cookies.table;

exports.up = function(knex) {
  return knex.schema
    .dropTableIfExists(cookieTable)
    .then(() => {
      return knex.schema.dropTableIfExists(userTable);
    })
    .then(() => {
      return knex.schema.createTable(cookieTable, table => {
        table.string('cookie').primary();
        table.integer('community_profile_id').notNullable();
        table.integer('expires_epoch_s').notNullable();
      });
    });
};

exports.down = function() {
  return Promise.resolve();
};
