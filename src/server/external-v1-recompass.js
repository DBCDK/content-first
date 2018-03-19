'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const recompas = require('server/recompas');

router
  .route('/')
  //
  // GET /v1/recompass
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const {tags = {}, creators = {}, maxresults = 10} = req.query;
      const link = `${req.baseUrl}?tags=${req.query.tags || ''}&creators=${req
        .query.creators || ''}&maxresults=${maxresults}`;

      if (
        (!tags || Object.keys(tags).length === 0) &&
        (!creators || Object.keys(creators).length === 0)
      ) {
        return next({
          status: 400,
          title: 'Tags expected',
          detail:
            'You must supply at least one tag number or at least one creator, or a combination of those.',
          meta: {resource: link}
        });
      }

      try {
        const result = await recompas.getRecommendations({
          tags: tags,
          creators: creators,
          maxresults: parseInt(maxresults, 10)
        });
        res.status(200).json(result);
      } catch (e) {
        res.status(500).end(e.message);
      }
    })
  );

module.exports = router;
