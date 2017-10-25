'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {gettingUser} = require('server/user');

router.route('/:uuid')
  //
  // GET /v1/users/:uuid
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const uuid = req.params.uuid;
    const location = `${req.baseUrl}/${uuid}`;
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
  }))
;

module.exports = router;
