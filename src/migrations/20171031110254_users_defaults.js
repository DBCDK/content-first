'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.table(userTable, table => {
    table.dropColumn('name');
    table.dropColumn('gender');
    table.dropColumn('birth_year');
  })
    .then(() => {
      return knex.schema.table(userTable, table => {
        table.string('name').defaultTo('');
        table.string('gender').defaultTo('');
        table.integer('birth_year').defaultTo(-1);
      });
    });
};

exports.down = function() {
  return Promise.resolve();
};
