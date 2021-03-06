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
  putPrivatUserData,
  getPrivatUserData,
  getUser: objectStore.getUser,
  removingLoginToken,
  deleteUser,
  createCookie: config.server.isProduction ? createCookie : createCookieDev,
  fetchCookie,
  requireLoggedIn
};

async function userExists(openplatformToken, id) {
  return (
    (
      await objectStore.find(
        {
          type: 'USER_PROFILE',
          owner: id,
          limit: 1
        },
        {openplatformToken}
      )
    ).data.length !== 0
  );
}

/*
 * This intercepts createCookie calls when not in production
 * in order to support using minismaug with real user logins
 * It creates a token->configuration mapping in minismaug
 */
async function createCookieDev(uniqueId, openplatformToken, user) {
  await request
    .put(
      `http://${config.test.minismaug.host}:3333/configuration?token=${openplatformToken}`
    )
    .send({user: {uniqueId}, storage: null});
  return await createCookie(uniqueId, openplatformToken, user);
}

async function createCookie(uniqueId, openplatformToken, user) {
  const cookie = uuidv4();
  logger.log.debug(`Creating login token ${cookie}`);

  await knex(cookieTable).insert({
    cookie,
    community_profile_id: -1, // TODO remove this when users migrated
    openplatform_id: uniqueId,
    openplatform_token: openplatformToken,
    expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000),
    user
  });

  if (!(await userExists(openplatformToken, uniqueId))) {
    logger.log.info('userInfo', {
      message: `Creating user with uniqueId=${uniqueId}`
    });
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
  const res = (
    await knex(cookieTable)
      .select([
        'openplatform_id',
        'openplatform_token',
        'expires_epoch_s',
        'user'
      ])
      .where('cookie', cookie)
  )[0];

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

async function deleteUser(user) {
  await objectStore.deleteUser(user);
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

async function putPrivatUserData(user) {
  const existingData = await getPrivatUserData(user);

  // Add municipality and municipalityAgencyId to a privat user object
  try {
    await objectStore.put(
      {
        ...existingData,
        _type: 'USER_PRIVAT',
        municipality: user.municipality,
        municipalityAgencyId: user.municipalityAgencyId
      },
      {openplatformId: user.uniqueId, openplatformToken: user.openplatformToken}
    );
  } catch (error) {
    logger.log.error('PUT private user - Error', {
      errorMessage: error.message,
      stack: error.stack
    });
    throw error;
  }
}

async function getPrivatUserData(user) {
  // Add municipality and municipalityAgencyId to a privat user object
  try {
    const userData = await objectStore.find(
      {
        type: 'USER_PRIVAT',
        owner: user.uniqueId
      },
      {openplatformId: user.uniqueId, openplatformToken: user.openplatformToken}
    );

    return userData.data[0] || {};
  } catch (error) {
    logger.log.error('GET private user - error', {
      errorMessage: error.message,
      stack: error.stack
    });
    throw error;
  }
}

async function getUserData(openplatformId, loggedInuser) {
  try {
    throwUnlessOpenplatformId({openplatformId});

    const userData = (
      await objectStore.find(
        {type: 'USER_PROFILE', owner: openplatformId, public: true},
        loggedInuser
      )
    ).data[0];

    const shortlist = (
      await objectStore.find(
        {type: 'USER_SHORTLIST', owner: openplatformId},
        loggedInuser
      )
    ).data[0];

    const {data: roles} = await objectStore.getRoles(loggedInuser);

    if (!userData) {
      throw {
        status: 404,
        title: 'user not found',
        detail: `User ${openplatformId} does not exist or is deleted`
      };
    }

    // "in-comment" for testing role in permissions

    // return _.omitBy(
    //   {
    //     ...userData,
    //     roles: [
    //       {
    //         type: 'role',
    //         name: 'role',
    //         machineName: 'contentFirstEditor',
    //         displayName: 'Læsekompasredaktør',
    //         description: 'Redaktør for læsekompas',
    //         _public: true,
    //         _owner: 'cf-admin',
    //         _id: 'e946704a-228f-4e06-86d4-1e845de1fc73',
    //         _rev: '2019-09-06T10:48:01.379Z',
    //         _client: 'bbc3c505-61c3-4cf2-98bf-21eecdd8737b',
    //         _created: 1567766881,
    //         _modified: 1567766881
    //       }
    //     ],
    //     ...shortlist,
    //     ...{openplatformId}
    //   },
    //   (v, k) => k.startsWith('_')
    // );

    return _.omitBy(
      {...userData, roles, ...shortlist, ...{openplatformId}},
      (v, k) => k.startsWith('_')
    );
  } catch (error) {
    logger.log.error('GET user - error', {
      errorMessage: error.message,
      stack: error.stack
    });
    throw error;
  }
}

async function putUserData(newUserData, user) {
  try {
    const openplatformId = user.openplatformId;
    throwUnlessOpenplatformId({openplatformId});

    let userData = (
      await objectStore.find(
        {type: 'USER_PROFILE', owner: openplatformId},
        user
      )
    ).data[0];
    let shortlist = (
      await objectStore.find(
        {type: 'USER_SHORTLIST', owner: openplatformId},
        user
      )
    ).data[0];

    await objectStore.put(
      _.omit(
        {
          ...(userData || {}),
          ...newUserData,
          _type: 'USER_PROFILE',
          _public: true
        },
        ['openplatformToken', 'shortlist', 'roles']
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
    logger.log.error('PUT user - error', {
      errorMessage: error.message,
      stack: error.stack
    });
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
