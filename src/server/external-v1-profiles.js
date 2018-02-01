'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {
  gettingUserFromToken,
  gettingUser,
  findingUserIdTroughLoginToken,
  updatingUser
} = require('server/user');
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/profiles-in.json');

router
  .route('/')

  //
  // GET /v1/profiles
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;
      return gettingUserFromToken(req)
        .then(user => {
          res.status(200).json({
            data: user.profiles,
            links: {self: location}
          });
        })
        .catch(next);
    })
  )

  //
  // PUT /v1/profiles
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'Data has to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      const profiles = req.body;
      try {
        await validatingInput(profiles, schema);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed profiles',
          detail: 'Profiles do not adhere to schema',
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
          profiles: profiles
        });
      } catch (error) {
        return next(error);
      }
      return gettingUser(userId)
        .then(user => {
          res.status(200).json({
            data: user.profiles,
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
