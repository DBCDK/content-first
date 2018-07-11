'use strict';

/**
 * The pupose of this module is to take care of data-format translation
 * between the community and the frontend.
 */

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const logger = require('server/logger');
const _ = require('lodash');
const objectStore = require('server/objectStore');

module.exports = {
  putUserData,
  getUserData,
  getUser: objectStore.getUser,
  removingLoginToken
};

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

function removingLoginToken(token) {
  return knex(cookieTable)
    .where('cookie', token)
    .del();
}
