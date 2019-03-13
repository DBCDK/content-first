'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const searcher = require('server/searcher');

router
  .route('')
  //
  // GET /v1/search
  //
  .get(
    asyncMiddleware(async (req, res) => {
      try {
        const result = await searcher.getSearchResult(req.query);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(500).end(e.message);
      }
    })
  );

module.exports = router;
