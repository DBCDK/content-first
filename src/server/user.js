'use strict';

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const userTable = constants.users.table;

async function gettingUser (uuid) {
  return new Promise((resolve, reject) => {
    return knex(userTable).where({uuid}).select(
      'name',
      'lists',
      'shortlist',
      'profiles'
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

async function findingUserByCprHash (cpr) {
  return new Promise((resolve, reject) => {
    return knex(userTable).where({cpr}).select('uuid')
      .then(existing => {
        if (existing.length === 0) {
          return resolve(null);
        }
        return resolve(existing[0].uuid);
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

async function gettingUserIdFromLoginToken (token) {
  return new Promise((resolve, reject) => {
    return knex(cookieTable).where('uuid', token).select('user', 'expires_epoch_s')
    .then(existing => {
      if (existing.length === 0) {
        return reject({
          status: 404,
          title: 'Unknown login token',
          detail: `Token ${token} does not exist`
        });
      }
      const expires_s = existing[0].expires_epoch_s;
      const now_s = Math.ceil(Date.now() / 1000);
      if (now_s >= expires_s) {
        return reject({
          status: 403,
          title: 'Login token has expired',
          detail: `Token ${token} has expired`
        });
      }
      const uuid = existing[0].user;
      return resolve(uuid);
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

async function updatingUser (uuid, partialData) {
  return new Promise((resolve, reject) => {
    return knex(userTable).where({uuid}).update(partialData)
      .then(() => {
        return resolve(uuid);
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

async function removingLoginToken (token) {
  return knex(cookieTable).where('uuid', token).del();
}

module.exports = {
  gettingUser,
  findingUserByCprHash,
  gettingUserIdFromLoginToken,
  updatingUser,
  removingLoginToken
};
