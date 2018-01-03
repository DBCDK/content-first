'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.table(userTable, table => {
    table.dropColumn('authors');
    table.dropColumn('atmosphere');
    table
      .jsonb('profiles')
      .notNullable()
      .defaultTo('[]');
  });
};

exports.down = function() {
  return Promise.resolve();
};
