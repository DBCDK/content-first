'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;

router
  .route('/')
  //
  // GET /v1/search?q=...
  //
  .get(
  // eslint-disable-next-line no-unused-vars
    asyncMiddleware(async (req, res, next) => {

      const results = await knex(bookTable)
        .select()
        .whereRaw(
          'to_tsvector(\'danish\', creator || \' \' || title_full) @@ to_tsquery(\'danish\', ?)',
          [req.query.q || '']
        );

      // TODO: remove the sleep, - currently added because search is fast due to very few data, and we also want to see what things looks like if search is slow.
      await new Promise(resolve => setTimeout(resolve, 500));

      res.status(200).json({data: results});
    })
  );

module.exports = router;
