'use strict';

module.exports = {
  creatingUser,
  findingUserByUserIdHash,
  gettingListsFromToken,
  gettingUser,
  gettingUserFromToken,
  gettingUserIdFromLoginToken,
  removingLoginToken,
  updatingLists,
  updatingUser
};

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const community = require('server/community');
const transform = require('__/services/elvis/transformers');
const _ = require('lodash');

function gettingUser (userId) {
  return community.gettingUserByProfileId(userId);
}

function findingUserByUserIdHash (userIdHash) {
  return community.gettingProfileIdByUserIdHash(userIdHash)
  .catch(() => {
    // UserId not found.
    return null;
  });
}

function creatingUser (userIdHash) {
  return community.creatingUserProfile({
    name: '',
    attributes: {
      user_id: userIdHash,
      shortlist: [],
      tastes: []
    }
  })
  .then(profile => {
    return profile.id;
  });
}

function gettingUserIdFromLoginToken (token) {
  return new Promise((resolve, reject) => {
    return knex(cookieTable)
    .where('cookie', token).select('community_profile_id', 'expires_epoch_s')
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
      return resolve(existing[0].community_profile_id);
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

function removingLoginToken (token) {
  return knex(cookieTable).where('cookie', token).del();
}

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
      const returnedError = {meta: {resource: location}};
      Object.assign(returnedError, error);
      return reject(returnedError);
    }
  });
}

async function updatingUser (userId, partialData) {
  const {profile, lists} = transform.transformFrontendUserToProfileAndEntities(partialData);
  await community.updatingProfileWithShortlistAndTastes(userId, profile);
  await updatingTransformedLists(userId, lists);
}

function gettingListsFromToken (req) {
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
      const lists = await community.gettingAllListEntitiesOwnedByProfileId(userId);
      return resolve(lists);
    }
    catch (error) {
      let meta = error;
      if (meta.response) {
        meta = meta.response;
      }
      if (meta.error) {
        meta = meta.error;
      }
      return reject({
        status: 503,
        title: 'Community-service connection problem',
        detail: 'Community service is not reponding properly',
        meta
      });
    }
  });
}

function updatingLists (userId, lists) {
  return updatingTransformedLists(userId, transform.transformListsToLists(lists));
}

async function updatingTransformedLists(userId, lists) {
  const alreadyExist = await community.gettingIdsOfAllListEntitiesOwnedByUserWithProfileId(userId);
  const {toCreate, toUpdate, toDelete} = transform.divideListsIntoCreateUpdateAndDeleteForProfileId(
    lists,
    alreadyExist,
    userId
  );
  let chain = Promise.resolve();
  for (const document of toCreate) {
    chain = chain.then(() => {
      return community.creatingListEntity(userId, document);
    });
  }
  for (const document of toUpdate) {
    chain = chain.then(() => {
      const entityId = document.id;
      const listWithoutId = _.omit(document, 'id');
      return community.updatingListEntity(userId, entityId, listWithoutId);
    });
  }
  for (const entityId of toDelete) {
    chain = chain.then(() => {
      return community.updatingListEntity(userId, entityId, {});
    });
  }
  await chain;
}
