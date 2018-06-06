'use strict';

const constants = require('server/constants')();
const coverTable = constants.covers.table;

exports.up = function(knex) {
  return knex.schema.table(coverTable, table => {
    table.string('owner');
  });
};

exports.down = function() {
  return Promise.resolve();
};
