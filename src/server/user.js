'use strict';

module.exports = {
  gettingUserFromToken,
  gettingUser,
  findingUserByCprHash,
  gettingUserIdFromLoginToken,
  updatingUser,
  removingLoginToken
};

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const userTable = constants.users.table;

function gettingUserFromToken (req) {
  return new Promise(async (resolve, reject) => {
    const location = req.baseUrl;
    const loginToken = req.cookies['login-token'];
    if (!loginToken) {
      return reject({
        status: 403,
        title: 'User not logged in',
        detail: 'Missing login-token cookie',
        meta: {resource: location}
      });
    }
    let userId;
    try {
      userId = await gettingUserIdFromLoginToken(loginToken);
    }
    catch (error) {
      if (error.status === 404) {
        return reject({
          status: 403,
          title: 'User not logged in',
          detail: `Unknown login token ${loginToken}`,
          meta: {resource: location}
        });
      }
      return reject({
        status: 403,
        title: 'User not logged in',
        detail: `Login token ${loginToken} has expired`,
        meta: {resource: location}
      });
    }
    try {
      const user = await gettingUser(userId);
      return resolve(user);
    }
    catch (error) {
      Object.assign(error, {
        meta: {resource: location}
      });
      return reject(error);
    }
  });
}

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
