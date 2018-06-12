'use strict';

/*
 * Special endpoint for Hejmdal to redirect to when a user has sucessfully
 * logged in.
 */

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const logger = require('server/logger');
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const ms_OneMonth = 30 * 24 * 60 * 60 * 1000;
const loginService = require('server/login');
const uuidv4 = require('uuid/v4');
const {putUserData} = require('server/user');
const objectStore = require('server/objectStore');
const community = require('server/community');

router
  .route('/')
  //
  // GET /hejmdal?token=...&id=...
  //
  .get(
    asyncMiddleware(async (req, res) => {
      const token = req.query.token;
      const id = req.query.id;
      const loginToken = uuidv4();
      try {
        const {
          openplatformId,
          openplatformToken
        } = await loginService.gettingTicket(token, id);

        logger.log.debug('Got remote user data');
        // TODO remove legacy code when users migrated BEGIN
        let userId = -1;
        try {
          userId = await community.gettingProfileIdByOpenplatformId(
            openplatformId
          );
        } catch (e) {
          // do nothing;
        }
        // TODO remove legacy code END

        logger.log.debug(
          `User info ${JSON.stringify(
            openplatformId,
            openplatformToken
          )}, userId ${userId}, openplatformId, ${openplatformId}`
        );

        logger.log.debug(`Creating login token ${loginToken}`);
        await knex(cookieTable).insert({
          cookie: loginToken,
          community_profile_id: userId, // TODO remove this when users migrated
          openplatform_id: openplatformId,
          openplatform_token: openplatformToken,
          expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000)
        });

        req.cookies['login-token'] = loginToken;
        if (
          userId === -1 &&
          (await objectStore.find({
            type: 'USER_PROFILE',
            owner: openplatformId,
            limit: 1
          })).data.length === 0
        ) {
          await putUserData(
            {
              name: '',
              roles: [],
              openplatformId,
              shortlist: [],
              profiles: [],
              lists: []
            },
            req
          );
        }

        logger.log.debug(`Redirecting with token ${loginToken}`);
        return res
          .status(303)
          .location(constants.pages.start)
          .cookie('login-token', loginToken, {
            httpOnly: true
            /* TODO: add "secure: true" in production? */
            /* maxAge is not set, hence the cookie is removed when user closes browser (like it is in Hejmdal) */
          })
          .send();
      } catch (error) {
        let errorMsg = JSON.stringify(error);
        if (errorMsg === '{}') {
          errorMsg = error.toString();
        }
        logger.log.error(`Problem getting remote user data: ${errorMsg}`);
        return res
          .status(303)
          .location(constants.pages.generalError)
          .send(error);
      }
    })
  );

module.exports = router;
