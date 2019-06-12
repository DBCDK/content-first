'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const {putUserData} = require('server/user');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const uuidv4 = require('uuid/v4');
const objectStore = require('server/objectStore');
const request = require('superagent');
const ms_OneMonth = 30 * 24 * 60 * 60 * 1000;

router
  .route('/logout/')
  // Log in only and create user manually
  // GET /v1/test/login/:id
  //
  .get(
    asyncMiddleware(async (req, res) => {
      return res
        .status(303)
        .clearCookie('test-user-data')
        .location('http://localhost:3000')
        .send();
    })
  );

router
  .route('/login/:id')
  // Log in only and create user manually
  // GET /v1/test/login/:id
  //
  .get(
    asyncMiddleware(async (req, res) => {
      try {
        const loginToken = await createUser(req, false);
        const user = {
          openplatformId: req.params.id,
          openplatformToken: req.params.id,
          expires: Math.ceil((Date.now() + ms_OneMonth) / 1000),
          special: {
            over13: true,
            name: req.params.id
          }
        };
        req.user = user;
        return res
          .status(303)
          .location('http://localhost:3000/replay')
          .cookie('login-token', loginToken, {
            httpOnly: true
          })
          .cookie('test-user-data', JSON.stringify(user))
          .send();
      } catch (error) {
        let errorMsg = JSON.stringify(error);
        if (errorMsg === '{}') {
          errorMsg = error.toString();
        }
        return res.status(400).send(error);
      }
    })
  );

router
  .route('/create/:id')
  // Log in and create user
  // GET /v1/test/create/:id
  //
  .get(
    asyncMiddleware(async (req, res) => {
      try {
        const loginToken = await createUser(req, true);
        const user = {
          openplatformId: req.params.id,
          openplatformToken: req.params.id,
          expires: Math.ceil((Date.now() + ms_OneMonth) / 1000),
          special: {
            over13: true,
            name: req.params.id
          }
        };
        return res
          .status(303)
          .location('http://localhost:3000/replay')
          .cookie('login-token', loginToken, {
            httpOnly: true
          })
          .cookie('test-user-data', JSON.stringify(user))
          .send();
      } catch (error) {
        let errorMsg = JSON.stringify(error);
        if (errorMsg === '{}') {
          errorMsg = error.toString();
        }
        return res.status(400).send(error);
      }
    })
  );

/**
 *
 * test age and name
 **/

/**
 *
 * Log in with user name and over 13 boolean (1 or !1)
 * GET /v1/test/login/:id
 */

router.route('/cprlogin/:id/:over13').get(
  asyncMiddleware(async (req, res) => {
    try {
      const loginToken = await createUser(req, false);
      const user = {
        openplatformId: req.params.id,
        openplatformToken: req.params.id,
        expires: Math.ceil((Date.now() + ms_OneMonth) / 1000),
        special: {
          over13: req.params.over13 === '1' ? true : false,
          name: req.params.id
        }
      };

      req.user = user;
      return res
        .status(303)
        .location('http://localhost:3000/replay')
        .cookie('login-token', loginToken, {
          httpOnly: true
        })
        .cookie('test-user-data', JSON.stringify(user))
        .send();
    } catch (error) {
      let errorMsg = JSON.stringify(error);
      if (errorMsg === '{}') {
        errorMsg = error.toString();
      }
      return res.status(400).send(error);
    }
  })
);

/**
 *
 * @param {String} id openplatform_id
 * @param {boolean} createUser   if true: create user profile and log in. Else only log in
 */
async function createUser(req, doCreateUser) {
  const loginToken = uuidv4();
  const id = req.params.id;
  await knex(cookieTable).insert({
    cookie: loginToken,
    community_profile_id: -1,
    openplatform_id: id,
    openplatform_token: id,
    expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000)
  });
  req.cookies['login-token'] = loginToken;
  await request
    .put(`http://localhost:3333/configuration?token=${id}`)
    .send({user: {uniqueId: id}, storage: null});
  if (
    (await objectStore.find({
      type: 'USER_PROFILE',
      owner: id,
      limit: 1
    })).data.length === 0
  ) {
    // create user in db if user dosn't exist
    await putUserData(
      {
        name: doCreateUser ? id : '',
        roles: [],
        openplatformId: id,
        shortlist: [],
        profiles: [],
        lists: [],
        acceptedAge: doCreateUser ? true : false,
        acceptedTerms: doCreateUser ? true : false
      },
      {openplatformId: id, openplatformToken: id}
    );
  }

  return loginToken;
}

let typeId;
const admin = {
  id: 'test_admin_id',
  token: 'test_admin_token'
};
const user1 = {
  id: '123openplatformId456',
  token: '123openplatformToken456'
};
const user2 = {
  id: '123openplatformId2',
  token: '123openplatformToken2'
};

router.route('/initStorage').get(
  asyncMiddleware(async (req, res) => {
    await request
      .put(`http://localhost:3333/configuration?token=${admin.token}`)
      .send({storage: {user: admin.id}});
    await request
      .put(`http://localhost:3333/configuration?token=anon_token`)
      .send({storage: null, user: {uniqueId: null}});
    await request
      .put(`http://localhost:3333/configuration?token=${user1.token}`)
      .send({user: {uniqueId: user1.id}, storage: null});
    await request
      .put(`http://localhost:3333/configuration?token=${user2.token}`)
      .send({user: {uniqueId: user2.id}, storage: null});

    typeId = (await request.post(config.storage.url).send({
      access_token: admin.token,
      put: {
        _type: 'bf130fb7-8bd4-44fd-ad1d-43b6020ad102',
        name: 'content-first-objects',
        description: 'Type used during integration test',
        type: 'json',
        permissions: {read: 'if object.public'},
        indexes: [
          {value: '_id', keys: ['cf_type', 'cf_key', 'cf_created']},
          {value: '_id', keys: ['cf_type', 'cf_created']},
          {
            value: '_id',
            keys: ['_owner', 'cf_type', 'cf_key', 'cf_created'],
            private: true
          },
          {
            value: '_id',
            keys: ['_owner', 'cf_type', 'cf_key', 'cf_created']
          },
          {
            value: '_id',
            keys: ['_owner', 'cf_type', 'cf_created'],
            private: true
          },
          {
            value: '_id',
            keys: ['_owner', 'cf_type', 'cf_created']
          }
        ]
      }
    })).body.data._id;
    await objectStore.setupObjectStore({
      typeId,
      url: config.storage.url
    });
    res.status(200).send(typeId);
  })
);
router.route('/wipeStorage').get(
  asyncMiddleware(async (req, res) => {
    try {
      if (typeId) {
        await request.post(config.storage.url).send({
          access_token: admin.token,
          delete: {_id: typeId}
        });
      }
    } catch (e) {
      // swallow
    }

    res.status(200).send('OK');
  })
);

module.exports = router;
