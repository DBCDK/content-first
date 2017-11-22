'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config').login;
const constants = require('server/constants')();
const logger = require('server/logger');
const {removingLoginToken} = require('server/user');
const authenticator = require('server/authenticator');

router.route('/')
  //
  // POST /v1/logout
  //
  .post(asyncMiddleware(async (req, res, next) => {
    let smaugToken;
    try {
      smaugToken = await authenticator.gettingToken();
    }
    catch (error) {
      return next({
        status: 503,
        title: 'Authentication-service communication failed',
        detail: `Subsystem returned ${JSON.stringify(error)}`
      });
    }
    const loginToken = req.cookies['login-token'];
    if (!loginToken) {
      return res.status(303).location(constants.pages.loggedOut).send();
    }
    const remoteLogoutUrl =
      `${config.url}/logout?token=${smaugToken}&returnurl=${constants.pages.loggedOut}`;
    return removingLoginToken(loginToken)
      .catch(error => {
        logger.log.info(`Logout problem: ${error}`);
      })
      .then(() => {
        return res.status(303).location(remoteLogoutUrl).send();
      });
  }))
;

module.exports = router;
