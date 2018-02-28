'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const parameters = require('__/parameters');
const request = require('superagent');
const logger = require('server/logger');
const _ = require('lodash');

router
  .route('/')
  //
  // GET /v1/recompass
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const tags = parameters.parseList(req.query.tags);
      const creators = parameters.parseList(req.query.creators);
      const maxresults = req.query.maxresults
        ? parseInt(req.query.maxresults, 10)
        : 10;
      const link = `${req.baseUrl}?tags=${req.query.tags || ''}&creators=${req
        .query.creators || ''}&maxresults=${maxresults}`;

      if (
        (!tags || tags.length === 0) &&
        (!creators || creators.length === 0)
      ) {
        return next({
          status: 400,
          title: 'Tags expected',
          detail:
            'You must supply at least one tag number or at least one creator, or a combination of those.',
          meta: {resource: link}
        });
      }

      const tagsWeighted = {};
      if (tags) {
        tags.forEach(tag => {
          tagsWeighted[tag] = 1; // for now we use same weight for all tags
        });
      }

      const creatorsWeighted = {};
      if (creators) {
        creators.forEach(creator => {
          creatorsWeighted[creator] = 1; // for now we use same weight for all creators
        });
      }

      try {
        const result = await request
          .post(config.recompass.url)
          .send({tags: tagsWeighted, creators: creatorsWeighted, maxresults});
        res.status(200).json(result.body);
      } catch (e) {
        const msg = _.get(e, 'response.body.value') || 'Internal server error';
        logger.log.error({
          source: 'external-v1-recompass',
          error: msg
        });
        res.status(500).end(msg);
      }
    })
  );

module.exports = router;
