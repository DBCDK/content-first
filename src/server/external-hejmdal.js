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
const {
  findingUserIdByOpenplatformId,
  creatingUserByOpenplatformId,
  updatingUser
} = require('server/user');

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
        const remoteUser = await loginService.gettingTicket(token, id);
        logger.log.debug('Got remote user data');
        const userId =
          (await findingUserIdByOpenplatformId(remoteUser.openplatformId)) ||
          (await creatingUserByOpenplatformId(remoteUser.openplatformId));
        logger.log.debug(
          `User info ${JSON.stringify(remoteUser)}, userId ${userId}`
        );
        await updatingUser(userId, remoteUser);

        logger.log.debug(`Creating login token ${loginToken}`);
        await knex(cookieTable).insert({
          cookie: loginToken,
          community_profile_id: userId,
          openplatform_id: remoteUser.openplatformId,
          expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000)
        });

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
