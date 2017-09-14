'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
// const config = require('server/config');
// const knex = require('knex')(config.db);
// const constants = require('server/constants')();
// const _ = require('lodash');

router.route('/')
  .put(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'Taxonomy has to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    try {
      res.status(200).send('done');
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed tags data',
        detail: 'Tags data does not adhere to schema',
        meta: error.meta || error
      });
    }
  }))
;

module.exports = router;
