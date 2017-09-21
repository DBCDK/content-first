'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const table = constants.users.table;
const uuidv4 = require('uuid/v4');

router.route('/')
  .post(asyncMiddleware(async (req, res, next) => {
    try {
      const uuid = uuidv4();
      await knex(table).insert({uuid});
      const location = `/v1/users/${uuid}`;
      res.status(200).json({
        data: {uuid},
        links: {self: location}
      });
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: req.baseUrl}
      });
    }
  }))
;

module.exports = router;
