'use strict';

const constants = require('server/constants')();
const cookieTable = constants.cookies.table;

exports.up = async function(knex) {
  await knex(cookieTable).del();
  await knex.schema.table(cookieTable, table => {
    table.string('openplatform_id').notNullable();
  });
};

exports.down = function() {
  return Promise.resolve();
};
