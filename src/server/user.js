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
const ms_OneMonth = 30 * 24 * 60 * 60 * 1000;
const uuidv4 = require('uuid/v4');
const request = require('superagent');

module.exports = {
  putUserData,
  getUserData,
  getUser: objectStore.getUser,
  removingLoginToken,
  deleteUser,
  createCookie: config.server.isProduction ? createCookie : createCookieDev,
  fetchCookie,
  requireLoggedIn
};

async function userExists(openplatformToken, id) {
  return (
    (await objectStore.find(
      {
        type: 'USER_PROFILE',
        owner: id,
        limit: 1
      },
      {openplatformToken}
    )).data.length !== 0
  );
}

/*
 * This intercepts createCookie calls when not in production
 * in order to support using minismaug with real user logins
 * It creates a token->configuration mapping in minismaug
 */
async function createCookieDev(legacyId, uniqueId, openplatformToken, user) {
  await request
    .put(`http://localhost:3333/configuration?token=${openplatformToken}`)
    .send({user: {uniqueId}, storage: null});
  return await createCookie(legacyId, uniqueId, openplatformToken, user);
}

async function createCookie(legacyId, uniqueId, openplatformToken, user) {
  const cookie = uuidv4();
  logger.log.debug(`Creating login token ${cookie}`);

  await knex(cookieTable).insert({
    cookie,
    community_profile_id: -1, // TODO remove this when users migrated
    openplatform_id: uniqueId,
    openplatform_token: openplatformToken,
    expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000),
    user: user
  });

  if (!(await userExists(openplatformToken, uniqueId))) {
    logger.log.info(`Creating user with uniqueId=${uniqueId}`);
    await putUserData(
      {
        name: '',
        roles: [],
        openplatformId: uniqueId,
        shortlist: [],
        profiles: [],
        lists: [],
        over13: user.over13
      },
      {openplatformId: uniqueId, openplatformToken}
    );
  }
  return cookie;
}
async function fetchCookie(cookie) {
  const res = (await knex(cookieTable)
    .select([
      'openplatform_id',
      'openplatform_token',
      'expires_epoch_s',
      'user'
    ])
    .where('cookie', cookie))[0];

  if (!res || res.expires_epoch_s < Date.now() / 1000) {
    throw {
      status: 403,
      title: 'user not logged in',
      detail: 'User not logged in or session expired'
    };
  }

  return {
    openplatformId: res.openplatform_id,
    openplatformToken: res.openplatform_token,
    expires: res.expires_epoch_s,
    special: res.user
  };
}

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

function throwUnlessOpenplatformId({openplatformId}) {
  if (!openplatformId) {
    throw {
      status: 403,
      title: 'user not logged in',
      detail: `User not logged in or session expired`
    };
  }
}

async function getUserData(openplatformId, loggedInuser) {
  try {
    throwUnlessOpenplatformId({openplatformId});

    let userData = (await objectStore.find(
      {type: 'USER_PROFILE', owner: openplatformId, public: true},
      loggedInuser
    )).data[0];
    let shortlist = (await objectStore.find(
      {type: 'USER_SHORTLIST', owner: openplatformId},
      loggedInuser
    )).data[0];

    if (!userData) {
      throw {
        status: 404,
        title: 'user not found',
        detail: `User ${openplatformId} does not exist or is deleted`
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
async function putUserData(newUserData, user) {
  try {
    const openplatformId = user.openplatformId;
    throwUnlessOpenplatformId({openplatformId});

    let userData = (await objectStore.find(
      {type: 'USER_PROFILE', owner: openplatformId},
      user
    )).data[0];
    let shortlist = (await objectStore.find(
      {type: 'USER_SHORTLIST', owner: openplatformId},
      user
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
      user
    );
    await objectStore.put(
      {
        ...(shortlist || {}),
        ..._.pick(newUserData, ['shortlist']),
        _type: 'USER_SHORTLIST',
        _public: false
      },
      user
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

function requireLoggedIn(req, res, next) {
  if (!_.get(req, 'user.openplatformId')) {
    throw {
      status: 200,
      title: 'user not logged in',
      detail: `User not logged in or session expired`,
      meta: {resource: req && req.baseUrl}
    };
  } else {
    next();
  }
}
