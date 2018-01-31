'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/role-in.json');
const {
  updatingUser,
  gettingUserWithListsByOpenplatformId
} = require('server/user');
const _ = require('lodash');

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
      try {
        const user = await gettingUserWithListsByOpenplatformId(openplatformId);
        const roles = _.union(user.roles, [req.body.role]);
        await updatingUser(user.id, {roles});
        return res.status(200).send(user);
      } catch (error) {
        return next(error);
      }
    })
  );

module.exports = router;
