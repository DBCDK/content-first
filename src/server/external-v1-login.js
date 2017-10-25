'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const {gettingUser} = require('server/user');
// const uuidv4 = require('uuid/v4');
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const authenticator = require('server/authenticator');

router.route('/')
  //
  // GET /v1/login
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const location = req.baseUrl;
    let loginToken = req.cookies['login-token'];
    if (loginToken) {
      let existing;
      try {
        existing = await knex(cookieTable).where('uuid', loginToken).select('user', 'expires_epoch_s');
      }
      catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {
            resource: location,
            'login-token': loginToken
          }
        });
      }
      const now_s = Math.ceil(Date.now() / 1000);
      if (existing.length === 1) {
        const expires_s = existing[0].expires_epoch_s;
        if (now_s < expires_s) {
          const uuid = existing[0].user;
          const userLocation = `/v1/users/${uuid}`;
          return gettingUser(uuid)
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
      }
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
    const loginUrl = `${config.openplatform.url}/login?token=${token}`;
    return res.status(303).json({
      data: loginUrl,
      links: {
        login: loginUrl
      }
    });
  }))
;

module.exports = router;
