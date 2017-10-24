'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const authenticator = require('server/remote/authenticator');

router.route('/')
  //
  // GET /v1/authentication-token
  //
  .get(asyncMiddleware(async (req, res, next) => {
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
    res.status(200).json({
      data: token,
      links: {
        login: `https://login.bib.dk/login?token=${token}`
      }
    });
  }))
;

module.exports = router;
