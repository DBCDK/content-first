'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {gettingUser} = require('server/user');
const config = require('server/config');
// const uuidv4 = require('uuid/v4');

router.route('/')
  //
  // GET /v1/login
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const token = req.cookies['login-token'];
    if (token === 'C32E314E-8F12-45E3-8B52-17AA87E7699D') {
      const uuid = 'cd3cc362-d29c-4d40-8662-458664251e52';
      const location = `/v1/users/${uuid}`;
      return gettingUser(uuid)
        .then(user => {
          res.status(200).json({
            data: user,
            links: {self: location}
          });
        })
        .catch(error => {
          Object.assign(error, {
            meta: {resource: location}
          });
          next(error);
        });
    }
    const loginUrl = `${config.openplatform.url}/login?token=840e75ac9af8448898fe7f7c99198a7d`;
    res.status(303).json({
      data: loginUrl,
      links: {
        login: loginUrl
      }
    });
  }))
;

module.exports = router;
