'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.table(userTable, table => {
    table.string('cpr').defaultTo('');
    table.string('user_id').defaultTo('');
    table.string('wayf_id').defaultTo('');
    table.string('unilogin_id').defaultTo('');
    table.string('municipality').defaultsTo('');
  });
};

exports.down = function(knex) {
  return knex.schema.table(userTable, table => {
    table.dropColumn('cpr');
    table.dropColumn('user_id');
    table.dropColumn('wayf_id');
    table.dropColumn('unilogin_id');
    table.dropColumn('municipality');
  });
};
