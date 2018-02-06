'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const {
  gettingUserIdFromLoginToken,
  gettingUserWithLists
} = require('server/user');
const authenticator = require('server/authenticator');

router
  .route('/')
  //
  // GET /v1/login
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const loginToken = req.cookies['login-token'];
      if (loginToken) {
        try {
          const userId = await gettingUserIdFromLoginToken(loginToken);
          return gettingUserWithLists(userId)
            .then(user => {
              res.status(200).json({
                data: user,
                links: {self: '/v1/user'}
              });
            })
            .catch(error => {
              const returnedError = {meta: {resource: '/v1/user'}};
              Object.assign(returnedError, error);
              next(returnedError);
            });
        } catch (_) {
          // Any error will result in a redirection below to remote login service.
        }
      }
      let token;
      try {
        token = await authenticator.gettingToken();
      } catch (error) {
        return next({
          status: 503,
          title: 'Authentication-service communication failed',
          detail: `Subsystem returned ${JSON.stringify(error)}`
        });
      }
      const loginUrl = `${config.login.url}/login?token=${token}`;
      return res
        .status(303)
        .location(loginUrl)
        .json({
          data: loginUrl,
          links: {login: loginUrl}
        });
    })
  );

module.exports = router;
