'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const tagTable = constants.tags.table;

router.route('/:pid')
  //
  // GET /v1/tags/:pid
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const pid = req.params.pid;
    const location = `${req.baseUrl}/${pid}`;
    let result;
    try {
      result = await knex(tagTable).where({pid}).select(
        knex.raw('array_agg(tag) as tags')
      );
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
    const tags = result[0].tags;
    if (!tags) {
      return res.status(200).json({
        data: {pid, tags: []},
        links: {self: location}
      });
    }
    res.status(200).json({
      data: {pid, tags},
      links: {self: location}
    });
  }))
;

module.exports = router;
