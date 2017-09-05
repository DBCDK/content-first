'use strict';

const express = require('express');
const router = express.Router();
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
// const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const coverTable = constants.covers.table;

router.route('/image/:pid')

  .get(asyncMiddleware(async (req, res, next) => {
    const pid = req.params.pid;
    const images = await knex(coverTable).where('pid', pid).select();
    if (!images || images.length !== 1) {
      return next({
        status: 404,
        title: 'Unknown image',
        detail: `No cover for pid ${pid}`
      });
    }
    const image = images[0];
    res.contentType('jpeg');
    res.end(image.image, 'binary');
  }));

module.exports = router;
