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
  .route('/login/:id')
  //
  // GET /v1/test/login/:id
  //
  .get(
    asyncMiddleware(async (req, res) => {
      const loginToken = uuidv4();
      const openplatformId = req.params.id;
      const openplatformToken = req.params.id;

      try {
        let userId = -1;
        await knex(cookieTable).insert({
          cookie: loginToken,
          community_profile_id: userId,
          openplatform_id: openplatformId,
          openplatform_token: openplatformToken,
          expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000)
        });
        req.cookies['login-token'] = loginToken;
        if (
          (await objectStore.find({
            type: 'USER_PROFILE',
            owner: openplatformId,
            limit: 1
          })).data.length === 0
        ) {
          // create user in db if user dosn't exist
          await putUserData(
            {
              name: '',
              roles: [],
              openplatformId,
              shortlist: [],
              profiles: [],
              lists: [],
              acceptedAge: false,
              acceptedTerms: false
            },
            req
          );
        }
        return res
          .status(303)
          .location('http://localhost:3000/replay')
          .cookie('login-token', loginToken, {
            httpOnly: true
          })
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
  // Create user and log in
  // GET /v1/test/create/:id
  //
  .get(
    asyncMiddleware(async (req, res) => {
      const loginToken = uuidv4();
      const openplatformId = req.params.id;
      const openplatformToken = req.params.id;

      try {
        let userId = -1;
        await knex(cookieTable).insert({
          cookie: loginToken,
          community_profile_id: userId,
          openplatform_id: openplatformId,
          openplatform_token: openplatformToken,
          expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000)
        });
        req.cookies['login-token'] = loginToken;
        if (
          (await objectStore.find({
            type: 'USER_PROFILE',
            owner: openplatformId,
            limit: 1
          })).data.length === 0
        ) {
          // create user in db if user dosn't exist
          await putUserData(
            {
              name: openplatformId,
              roles: [],
              openplatformId,
              shortlist: [],
              profiles: [],
              lists: [],
              acceptedAge: true,
              acceptedTerms: true
            },
            req
          );
        }
        return res
          .status(303)
          .location('http://localhost:3000/replay')
          .cookie('login-token', loginToken, {
            httpOnly: true
          })
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

module.exports = router;
