'use strict';

/**
 * The pupose of this module is to take care of data-format translation
 * between the community and the frontend.
 */

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const community = require('server/community');
const logger = require('server/logger');
const {
  gettingListsForProfileId,
  omitCommunityInfoFromList
} = require('server/lists');
const _ = require('lodash');
const objectStore = require('server/objectStore');

module.exports = {
  putUserData,
  getUserData,
  getUser: objectStore.getUser,
  removingLoginToken,
  deleteUser
};

async function deleteUser(openplatformId) {
  await knex(constants.objects.table)
    .where('owner', openplatformId)
    .del();
  await knex(constants.cookies.table)
    .where('openplatform_id', openplatformId)
    .del();
  await knex(constants.covers.table)
    .where('owner', openplatformId)
    .del();
}

function throwUnlessOpenplatformId({openplatformId, reqUser, req}) {
  if (!openplatformId) {
    if (JSON.stringify(reqUser) === '{}') {
      throw {
        status: 403,
        title: 'user not logged in',
        detail: `User not logged in or session expired`,
        meta: {resource: req && req.baseUrl}
      };
    } else {
      throw {status: 500, error: 'missing openplatformId'};
    }
  }
}

async function getUserData({openplatformId, req}) {
  try {
    const reqUser = (await objectStore.getUser(req)) || {};
    openplatformId = openplatformId || reqUser.openplatformId;
    throwUnlessOpenplatformId({openplatformId, reqUser, req});

    let userData = (await objectStore.find(
      {type: 'USER_PROFILE', owner: openplatformId},
      reqUser
    )).data[0];
    let shortlist = (await objectStore.find(
      {type: 'USER_SHORTLIST', owner: openplatformId},
      reqUser
    )).data[0];

    // TODO remove migration code
    if (!userData) {
      try {
        userData = await community.gettingUserByOpenplatformId(openplatformId);
        userData = {...userData, ...(await gettingUserWithLists(userData.id))};
        shortlist = {shortlist: userData.shortlist, _type: 'USER_SHORTLIST'};
        userData = {
          ..._.omit(userData, ['openplatformToken', 'shortlist']),
          _type: 'USER_PROFILE',
          _public: true
        };

        await objectStore.put(userData, {openplatformId});
        await objectStore.put(shortlist, {openplatformId});

        userData = (await objectStore.find(
          {type: 'USER_PROFILE', owner: openplatformId},
          reqUser
        )).data[0];
        shortlist = (await objectStore.find(
          {type: 'USER_SHORTLIST', owner: openplatformId},
          reqUser
        )).data[0];
      } catch (e) {
        // do nothing
      }
    }
    // end migration code

    if (!userData) {
      throw {
        status: 404,
        title: 'user not found',
        detail: `User ${openplatformId} does not exist or is deleted`,
        meta: {resource: req && req.baseUrl}
      };
    }

    return _.omitBy({...userData, ...shortlist, ...{openplatformId}}, (v, k) =>
      k.startsWith('_')
    );
  } catch (error) {
    logger.log.error(error);
    throw error;
  }
}

async function putUserData(newUserData, req) {
  try {
    const reqUser = (await objectStore.getUser(req)) || {};
    const openplatformId = reqUser.openplatformId;
    throwUnlessOpenplatformId({openplatformId, reqUser, req});

    let userData = (await objectStore.find(
      {type: 'USER_PROFILE', owner: openplatformId},
      reqUser
    )).data[0];
    let shortlist = (await objectStore.find(
      {type: 'USER_SHORTLIST', owner: openplatformId},
      reqUser
    )).data[0];

    await objectStore.put(
      _.omit(
        {
          ...(userData || {}),
          ...newUserData,
          _type: 'USER_PROFILE',
          _public: true
        },
        ['openplatformToken', 'shortlist']
      ),
      {openplatformId}
    );
    await objectStore.put(
      {
        ...(shortlist || {}),
        ..._.pick(newUserData, ['shortlist']),
        _type: 'USER_SHORTLIST',
        _public: false
      },
      {openplatformId}
    );
  } catch (error) {
    logger.log.error(error);
    throw error;
  }
}

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

function removingLoginToken(token) {
  return knex(cookieTable)
    .where('cookie', token)
    .del();
}
