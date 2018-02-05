'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const jimp = require('jimp');
const _ = require('lodash');
const uuid = require('small-uuid');
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const {findingUserIdTroughLoginToken} = require('server/user');
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
//
// POST /v1/image/
//
router.route('/').post(
  asyncMiddleware(async (req, res, next) => {
    try {
      await findingUserIdTroughLoginToken(req);
    } catch (error) {
      return next(error);
    }
    const pid = uuid.create();
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
    await knex(coverTable).insert({pid, image: req.body});
    res
      .status(201)
      .location(location)
      .json({
        links: {self: location},
        id: uuid,
        data: `Created ${location}`
      });
  })
);
module.exports = router;
