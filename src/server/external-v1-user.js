'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {
  findingUserIdTroughLoginToken,
  gettingUserFromToken,
  gettingUserWithLists,
  updatingUser
} = require('server/user');
const {validatingInput} = require('__/json');
const path = require('path');
const userSchema = path.join(__dirname, 'schemas/user-in.json');
const shortlistSchema = path.join(__dirname, 'schemas/shortlist-in.json');
const profilesSchema = path.join(__dirname, 'schemas/profiles-in.json');

router
  .route('/')

  //
  // GET /v1/user
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;
      return gettingUserFromToken(req)
        .then(user => {
          res.status(200).json({
            data: user,
            links: {self: location}
          });
        })
        .catch(next);
    })
  )

  //
  // PUT /v1/user
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'User data has to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      const userInfo = req.body;
      try {
        await validatingInput(userInfo, userSchema);
        await validatingInput(userInfo.shortlist, shortlistSchema);
        await validatingInput(userInfo.profiles, profilesSchema);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed user data',
          detail: 'User data does not adhere to schema',
          meta: error.meta || error
        });
      }
      const location = req.baseUrl;
      let userId;
      try {
        userId = await findingUserIdTroughLoginToken(req);
      } catch (error) {
        return next(error);
      }
      try {
        await updatingUser(userId, {
          name: userInfo.name,
          shortlist: userInfo.shortlist,
          lists: userInfo.lists,
          profiles: userInfo.profiles
        });
      } catch (error) {
        return next(error);
      }
      return gettingUserWithLists(userId)
        .then(user => {
          res.status(200).json({
            data: user,
            links: {self: location}
          });
        })
        .catch(error => {
          const returnedError = {meta: {resource: location}};
          Object.assign(returnedError, error);
          next(returnedError);
        });
    })
  );

module.exports = router;
