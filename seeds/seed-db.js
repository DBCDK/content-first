'use strict';

const constants = require('server/constants')();
const table = constants.table;

exports.seed = knex => {
  return knex.raw(`alter sequence ${table}_id_seq restart with 1`)
    .then(() => {
      // 1
      return knex(table).insert({
        name: 'spændende'
      });
    })
    .catch(error => {
      throw error;
    });
};
