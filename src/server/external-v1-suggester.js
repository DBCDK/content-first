'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const suggester = require('server/suggester');

router
  .route('')
  //
  // GET /v1/suggester
  //
  .get(
    asyncMiddleware(async (req, res) => {
      try {
        const result = await suggester.getSuggestions(req.query);
        return res.status(200).json(result);
      } catch (e) {
        return res.status(500).end(e.message);
      }
    })
  );

module.exports = router;
