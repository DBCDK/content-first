'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const authenticator = require('server/remote/authenticator');

router.route('/')
  //
  // GET /v1/authentication-token
  //
  .get(asyncMiddleware(async (req, res) => {
    const token = await authenticator.gettingToken();
    res.status(200).json({
      data: token,
      links: {
        login: `https://login.bib.dk/login?token=${token}`
      }
    });
  }))
;

module.exports = router;
