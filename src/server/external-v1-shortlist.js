'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const userTable = constants.users.table;
const {gettingUser, gettingUserIdFromLoginToken} = require('server/user');
const {gettingUserFromToken} = require('server/v1-users-common');
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/shortlist-in.json');

router.route('/')

  //
  // GET /v1/shortlist
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const location = req.baseUrl;
    return gettingUserFromToken(req)
    .then(user => {
      res.status(200).json({
        data: user.shortlist,
        links: {self: location}
      });
    })
    .catch(error => {
      next(error);
    });
  }))

  //
  // PUT /v1/shortlist
  //
  .put(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'User data has to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    const shortlist = req.body;
    try {
      await validatingInput(shortlist, schema);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed shortlist',
        detail: 'Shortlist does not adhere to schema',
        meta: error.meta || error
      });
    }
    const location = req.baseUrl;
    const loginToken = req.cookies['login-token'];
    if (!loginToken) {
      return next({
        status: 403,
        title: 'User not logged in',
        detail: 'Missing login-token cookie',
        meta: {resource: location}
      });
    }
    let userId;
    try {
      userId = await gettingUserIdFromLoginToken(loginToken);
    }
    catch (error) {
      if (error.status === 404) {
        return next({
          status: 403,
          title: 'User not logged in',
          detail: `Unknown login token ${loginToken}`,
          meta: {resource: location}
        });
      }
      return next({
        status: 403,
        title: 'User not logged in',
        detail: `Login token ${loginToken} has expired`,
        meta: {resource: location}
      });
    }
    try {
      await knex(userTable).where('uuid', userId).update({
        shortlist: JSON.stringify(shortlist)
      });
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error
      });
    }
    return gettingUser(userId)
      .then(user => {
        res.status(200).json({
          data: user.shortlist,
          links: {self: location}
        });
      })
      .catch(error => {
        Object.assign(error, {
          meta: {resource: location}
        });
        next(error);
      });
  }))
;

module.exports = router;
