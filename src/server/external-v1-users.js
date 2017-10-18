'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const table = constants.users.table;

router.route('/:uuid')
  //
  // GET /v1/users/:uuid
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const uuid = req.params.uuid;
    const location = `${req.baseUrl}/${uuid}`;
    let existing;
    try {
      existing = await knex(table).where({uuid}).select('uuid');
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
    if (existing.length === 0) {
      return next({
        status: 404,
        title: 'Unknown user',
        detail: `User ${uuid} does not exist`,
        meta: {resource: location}
      });
    }
    res.status(200).json({
      data: {uuid},
      links: {self: location}
    });
  }))
;

module.exports = router;
