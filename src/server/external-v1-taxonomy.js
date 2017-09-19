'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const topTable = constants.taxonomy.topTable;
const middleTable = constants.taxonomy.middleTable;
const bottomTable = constants.taxonomy.bottomTable;
// const _ = require('lodash');

router.route('/')
  .get(asyncMiddleware(async (req, res, next) => {
    const location = `${req.baseUrl}`;
    try {
      const result = await knex(topTable).select();
      res.status(200).json({
        data: result,
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
