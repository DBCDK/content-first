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
        .send('hej');
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
          expires: Math.ceil((Date.now() + ms_OneMonth) / 1000)
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
          expires: Math.ceil((Date.now() + ms_OneMonth) / 1000)
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
      {openplatformId: id}
    );
  }

  return loginToken;
}

module.exports = router;
