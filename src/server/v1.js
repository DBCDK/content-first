'use strict';

const express = require('express');
const router = express.Router();
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const coverTable = constants.covers.table;

router.route('/image/:pid')

  .get((req, res, next) => {
    const pid = req.params.pid;
    knex(coverTable).where('pid', pid).select()
      .then(images => {
        if (!images || images.length !== 1) {
          return next({
            status: 404,
            title: 'Unknown image',
            detail: `No cover for pid ${pid}`
          });
        }
        return images[0];
      })
      .then(image => {
        logger.log.debug(`image pid ${image.pid}`);
        res.contentType('jpeg');
        res.end(image.image, 'binary');
      })
      .catch(error => {
        next(error);
      });
  });

module.exports = router;
