'use strict';

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const table = constants.users.table;

async function gettingUser (uuid) {
  return new Promise((resolve, reject) => {
    return knex(table).where({uuid}).select(
      'name', 'gender', 'birth_year', 'authors', 'atmosphere'
    )
      .then(existing => {
        if (existing.length === 0) {
          return reject({
            status: 404,
            title: 'Unknown user',
            detail: `User ${uuid} does not exist`
          });
        }
        resolve(existing[0]);
      })
      .catch(error => {
        reject({
          status: 500,
          title: 'Database operation failed',
          detail: error
        });
      });
  });
}

module.exports = {
  gettingUser
};
