'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const jimp = require('jimp');
const _ = require('lodash');
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
// const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const coverTable = constants.covers.table;

router.route('/:pid')
  .get(asyncMiddleware(async (req, res, next) => {
    const pid = req.params.pid;
    const location = `${req.baseUrl}/${pid}`;
    const images = await knex(coverTable).where('pid', pid).select();
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
  }))
  .put(asyncMiddleware(async (req, res, next) => {
    const pid = req.params.pid;
    const location = `${req.baseUrl}/${pid}`;
    const contentType = req.get('content-type');
    if (!_.includes([jimp.MIME_PNG, jimp.MIME_JPEG], contentType)) {
      return next({
        status: 400,
        title: 'Unsupported image type',
        detail: `Content type ${contentType} is not supported`,
        meta: {resource: location}
      });
    }
    const image = await jimp.read(req.body);
    if (!image) {
      return next({
        status: 400,
        title: 'Corrupted image data',
        meta: {resource: location}
      });
    }
    try {
      await knex(coverTable).insert({pid, image: req.body});
      res.status(201).location(location).json({
        links: {self: location},
        data: `Created ${location}`
      });
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Unsupported image type',
        detail: error,
        meta: {resource: location}
      });
    }
  }))
;

module.exports = router;
