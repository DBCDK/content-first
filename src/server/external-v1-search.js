'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;

const logger = require('server/logger');

router
  .route('/')
  //
  // GET /v1/search?q=...
  //
  .get(
    // eslint-disable-next-line no-unused-vars
    asyncMiddleware(async (req, res, next) => {
      const query = knex(bookTable)
        .select()
        .whereRaw("to_tsvector('simple', creator || ' ' || title_full) @@ ?", [
          req.query.q || ''
        ]);
      logger.log.debug('Knex search query', {query: query.toString()});
      const results = await query;
      res.status(200).json({data: results});
    })
  );

module.exports = router;
