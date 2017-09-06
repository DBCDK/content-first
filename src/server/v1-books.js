'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
// const config = require('server/config');
// const logger = require('__/logging')(config.logger);
// const knex = require('knex')(config.db);
// const constants = require('server/constants')();
// const coverTable = constants.covers.table;

router.route('/')
  .get(asyncMiddleware(async (req, res, next) => {
    return next({
      status: 400,
      title: 'PIDs expected',
      detail: 'You must supply at least one PID.'
    });
  }));

module.exports = router;
