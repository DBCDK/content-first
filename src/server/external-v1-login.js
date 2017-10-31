'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const {gettingUser, gettingUserIdFromLoginToken} = require('server/user');
const authenticator = require('server/authenticator');

router.route('/')
  //
  // GET /v1/login
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const loginToken = req.cookies['login-token'];
    let userId;
    if (loginToken) {
      try {
        userId = await gettingUserIdFromLoginToken(loginToken);
      }
      catch (_) {
        // Any error will result in a redirection to remote login service.
      }
    }
    const userLocation = '/v1/user';
    if (userId) {
      return gettingUser(userId)
        .then(user => {
          res.status(200).json({
            data: user,
            links: {self: userLocation}
          });
        })
        .catch(error => {
          Object.assign(error, {
            meta: {resource: userLocation}
          });
          next(error);
        });
    }
    let token;
    try {
      token = await authenticator.gettingToken();
    }
    catch (error) {
      return next({
        status: 503,
        title: 'Authentication-service communication failed',
        detail: `Subsystem returned ${error.status}`
      });
    }
    // token = uuidv4();
    const loginUrl = `${config.login.url}/login?token=${token}`;
    return res.status(303).json({
      data: loginUrl,
      links: {
        login: loginUrl
      }
    });
  }))
;

module.exports = router;
