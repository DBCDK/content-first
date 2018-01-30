'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/role-in.json');
const {updatingUser, findingUserByOpenplatformId} = require('server/user');

router
  .route('/')
  //
  // POST /v1/role-add
  //
  .post(
    asyncMiddleware(async (req, res, next) => {
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'User data have to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      try {
        await validatingInput(req.body, schema);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed role data',
          detail: 'Role data does not adhere to schema',
          meta: error.meta || error
        });
      }
      const openplatformId = req.body.openplatformId;
      let userId;
      try {
        userId = await findingUserByOpenplatformId(openplatformId);
        if (!userId) {
          return next({
            status: 404,
            title: 'User not found',
            detail: `No user with Openplatform Id ${openplatformId}`
          });
        }
        /*
        const result = await updatingUser(userId, {
          roles: []
        });
        */
        return res.status(200).send();
      } catch (error) {
        return next(error);
      }
    })
  );

module.exports = router;
