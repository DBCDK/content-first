'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {gettingUser, gettingUserIdFromLoginToken, gettingListsFromToken, updatingLists} = require('server/user');
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/lists-in.json');

router.route('/')

  //
  // GET /v1/lists
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const location = req.baseUrl;
    return gettingListsFromToken(req)
    .then(lists => {
      res.status(200).json({
        data: lists,
        links: {self: location}
      });
    })
    .catch(error => {
      next(error);
    });
  }))

  //
  // PUT /v1/lists
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
    const lists = req.body;
    try {
      await validatingInput(lists, schema);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed lists',
        detail: 'Lists do not adhere to schema',
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
      await updatingLists(userId, lists);
    }
    catch (error) {
      let meta = error;
      if (meta.response) {
        meta = meta.response;
      }
      if (meta.error) {
        meta = meta.error;
      }
      return next({
        status: 503,
        title: 'Community-service connection problem',
        detail: 'Community service is not reponding properly',
        meta
      });
    }
    return gettingUser(userId)
      .then(user => {
        res.status(200).json({
          data: user.lists,
          links: {self: location}
        });
      })
      .catch(error => {
        const returnedError = {meta: {resource: location}};
        Object.assign(returnedError, error);
        next(returnedError);
      });
  }))
;

module.exports = router;
