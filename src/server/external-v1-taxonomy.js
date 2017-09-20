'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const topTable = constants.taxonomy.topTable;

router.route('/')
  .get(asyncMiddleware(async (req, res, next) => {
    const location = `${req.baseUrl}`;
    try {
      const topResult = await knex(topTable).select(['id', 'title']);
      res.status(200).json({
        data: topResult,
        links: {self: location}
      });
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
  }))
;

module.exports = router;
