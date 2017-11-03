'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const constants = require('server/constants')();
const logger = require('server/logger');
const {removingLoginToken} = require('server/user');

router.route('/')
  //
  // POST /v1/logout
  //
  .post(asyncMiddleware(async (req, res) => {
    const loginToken = req.cookies['login-token'];
    if (!loginToken) {
      return res.status(303).location(constants.pages.start).send();
    }
    return removingLoginToken(loginToken)
      .catch(error => {
        logger.log.info(`Logout problem: ${error}`);
      })
      .then(() => {
        return res.status(303).location(constants.pages.start).send();
      });
  }))
;

module.exports = router;
