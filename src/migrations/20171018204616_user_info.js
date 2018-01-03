'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.table(userTable, table => {
    table.string('name');
    table.string('gender');
    table.integer('birth_year');
    table
      .jsonb('authors')
      .notNullable()
      .defaultTo('[]');
    table
      .jsonb('atmosphere')
      .notNullable()
      .defaultTo('[]');
  });
};

exports.down = function(knex) {
  return knex.schema.table(userTable, table => {
    table.dropColumn('name');
    table.dropColumn('gender');
    table.dropColumn('birth_year');
    table.dropColumn('authors');
    table.dropColumn('atmosphere');
  });
};
