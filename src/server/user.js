'use strict';

/**
 * The pupose of this module is to take care of data-format translation
 * between the community and the frontend.
 */

module.exports = {
  creatingUserByOpenplatformId,
  findingUserByOpenplatformId,
  findingUserIdTroughLoginToken,
  gettingUser,
  gettingUserFromToken,
  gettingUserIdFromLoginToken,
  gettingUserWithLists,
  removingLoginToken,
  updatingUser
};

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const community = require('server/community');
const transform = require('__/services/elvis/transformers');
const logger = require('server/logger');
const {
  gettingListsForProfileId,
  omitCommunityInfoFromList
} = require('server/lists');
const _ = require('lodash');

async function gettingUserWithLists(userId) {
  try {
    const user = await community.gettingUserByProfileId(userId);
    const listsPlusCommunityInfo = await gettingListsForProfileId(userId);
    user.lists = _.map(listsPlusCommunityInfo, omitCommunityInfoFromList);
    return user;
  } catch (error) {
    logger.log.debug(error);
    return Promise.reject(error);
  }
}

function gettingUser(userId) {
  return community
    .gettingUserByProfileId(userId) // force break
    .catch(error => {
      logger.log.debug(error);
      return Promise.reject(error);
    });
}

function findingUserByOpenplatformId(openplatformId) {
  return community
    .gettingProfileIdByOpenplatformId(openplatformId) // force break
    .catch(() => {
      // UserId not found.
      return null;
    });
}

function creatingUserByOpenplatformId(openplatformId) {
  return community
    .creatingUserProfile({
      name: '',
      attributes: {
        openplatform_id: openplatformId,
        shortlist: [],
        tastes: []
      }
    })
    .then(profile => {
      return profile.id;
    });
}

function removingLoginToken(token) {
  return knex(cookieTable)
    .where('cookie', token)
    .del();
}

function gettingUserFromToken(req) {
  return new Promise(async (resolve, reject) => {
    let userId;
    try {
      userId = await findingUserIdTroughLoginToken(req);
    } catch (error) {
      return reject(error);
    }
    try {
      const user = await gettingUserWithLists(userId);
      return resolve(user);
    } catch (error) {
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

// HERE:

/**
 * Promise of looking up userId from login token in HTTP request.
 * @param  {Request} req      HTTP Request object.
 * @param  {string}  location  Defaults to req.baseUrl
 * @return {Promise} Resolves to Community Profile ID, or rejects with status, title, etc
 */
function findingUserIdTroughLoginToken(req, location = null) {
  const url = location || req.baseUrl;
  return new Promise(async (resolve, reject) => {
    const loginToken = req.cookies['login-token'];
    if (!loginToken) {
      return reject({
        status: 403,
        title: 'User not logged in',
        detail: 'Missing login-token cookie',
        meta: {resource: url}
      });
    }
    let userId;
    try {
      userId = await gettingUserIdFromLoginToken(loginToken);
    } catch (error) {
      if (error.status === 404) {
        return reject({
          status: 403,
          title: 'User not logged in',
          detail: `Unknown login token ${loginToken}`,
          meta: {resource: url}
        });
      }
      return reject({
        status: 403,
        title: 'User not logged in',
        detail: `Login token ${loginToken} has expired`,
        meta: {resource: url}
      });
    }
    return resolve(userId);
  });
}

async function updatingUser(userId, partialData) {
  const {
    profile,
    lists
  } = transform.contentFirstUserToCommunityProfileAndEntities(partialData);
  if (profile.name || !_.isEmpty(profile.attributes)) {
    await community.updatingProfileWithShortlistAndTastes(userId, profile);
  }
  if (lists) {
    console.log('Lists not expected');
    throw new Error(['Lists not expected', lists]);
  }
}

function gettingUserIdFromLoginToken(token) {
  return new Promise((resolve, reject) => {
    return knex(cookieTable)
      .where('cookie', token)
      .select('community_profile_id', 'expires_epoch_s')
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
