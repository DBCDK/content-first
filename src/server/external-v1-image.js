'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const coverTable = constants.covers.table;

router
  .route('/:pid')
  //
  // GET /v1/image/:pid
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const pid = req.params.pid;
      const location = `${req.baseUrl}/${pid}`;
      const images = await knex(coverTable)
        .where('pid', pid)
        .select();
      if (!images || images.length !== 1) {
        return next({
          status: 404,
          title: 'Unknown image',
          detail: `No cover for pid ${pid}`,
          meta: {resource: location}
        });
      }
      const image = images[0];
      res.contentType('jpeg');
      res.end(image.image, 'binary');
    })
  );

module.exports = router;
