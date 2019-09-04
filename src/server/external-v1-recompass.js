'use strict';

const express = require('express');
const uuidGenerator = require('uuid');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {recompasWork, recompasTags} = require('server/recompas');
const matomo = require('server/matomo');
const logger = require('server/logger');

const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 60 * 60 * 4});

router
  .route('/')
  //
  // GET /v1/recompass
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const value = cache.get(req.originalUrl);
      if (value) {
        return res.status(200).json(value);
      }
      const recommender = req.query.recommender;
      if (recommender) {
        switch (recommender) {
          case 'recompasTags': {
            //
            // Recompas recommend based on tags
            //
            const {tags = {}, creators = {}, maxresults = 10} = req.query;

            const link = `${req.baseUrl}?tags=${req.query.tags ||
              ''}&creators=${req.query.creators ||
              ''}&maxresults=${maxresults}`;

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
              const result = await recompasTags.getRecommendations({
                tags: tags,
                creators: creators,
                maxresults: parseInt(maxresults, 10)
              });

              result.rid = uuidGenerator.v1();
              matomo.trackDataEvent(
                'recommend',
                Object.assign({}, result, {request: req.query})
              );

              cache.set(req.originalUrl, result);
              logger.log.debug('recompasTags', {
                originalUrl: req.originalUrl,
                result
              });
              return res.status(200).json(result);
            } catch (e) {
              return res.status(500).end(e.message);
            }
          }
          case 'recompasWork': {
            //
            // Recompas recommend based on pids
            //
            const {
              likes = [],
              dislikes = [],
              limit = 50,
              debug = true
            } = req.query;
            const link = `${req.baseUrl}?likes=${likes ||
              ''}&dislikes=${dislikes || ''}&limit=${limit}&debug=${debug}`;

            if (!likes || likes.length === 0) {
              return next({
                status: 400,
                title: 'Likes expected',
                detail:
                  'You must supply at least one pid, to get recommendations',
                meta: {resource: link}
              });
            }

            try {
              const result = await recompasWork.getRecommendations({
                likes: JSON.parse(likes),
                dislikes: JSON.parse(dislikes),
                limit: Number(limit),
                debug
              });

              result.rid = uuidGenerator.v1();
              matomo.trackDataEvent(
                'recommend',
                Object.assign({}, result, {request: req.query})
              );
              cache.set(req.originalUrl, result);
              logger.log.debug('recompasWork', {
                originalUrl: req.originalUrl,
                result
              });

              return res.status(200).json(result);
            } catch (e) {
              return res.status(500).end(e.message);
            }
          }
          default: {
            // Error: No valid recommender value
            const link = `${req.baseUrl}${req.query}`;
            return next({
              status: 400,
              title: 'No valid recommender specified',
              detail:
                'Please specify your "recommender" attribute with a valid recommender value ("recompasTags" || "recompasWorks")',
              meta: {resource: link}
            });
          }
        }
      }

      // Error: No recommender attribute
      return next({
        status: 400,
        title: 'No recommender specified',
        detail:
          'You must specify a recommender for your request. Please set a "recommender" attribute with a valid value ("recompasTags" || "recompasWorks")',
        meta: {resource: req.query}
      });
    })
  );

module.exports = router;
