'use strict';

const constants = require('server/constants')();
const cookieTable = constants.cookies.table;

exports.up = function(knex) {
  return knex.schema.table(cookieTable, table => {
    table
      .json('user')
      .notNullable()
      .defaultTo('{}');
  });
};

exports.down = function() {
  return Promise.resolve();
};
