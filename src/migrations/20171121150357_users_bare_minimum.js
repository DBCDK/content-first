'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.table(userTable, table => {
    table.dropColumn('gender');
    table.dropColumn('birth_year');
    table.dropColumn('wayf_id');
    table.dropColumn('unilogin_id');
    table.dropColumn('municipality');
  });
};

exports.down = function() {
  return Promise.resolve();
};
