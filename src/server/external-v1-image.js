const express = require('express');
const sharp = require('sharp');
const router = express.Router({mergeParams: true});
const jimp = require('jimp');
const _ = require('lodash');
const uuid = require('uuid/v4');
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const coverTable = constants.covers.table;
const {getUser} = require('./objectStore');

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
router
  .route('/:pid/:width/:height')
  //
  // GET /v1/image/:pid/:width/:height
  //
  .get(async (req, res, next) => {
    const {pid, width, height} = req.params;
    const location = `${req.baseUrl}/${pid}/${width}/${height}`;
    if (isNaN(width) || isNaN(height)) {
      return next({
        status: 404,
        title: 'Invalid image dimensions',
        detail: `Width and height must be numbers. ${width} and ${height} was provided`,
        meta: {resource: location}
      });
    }
    try {
      const imageCacheId = `${pid}-${width}-${height}`;
      const cachedImage = await knex(coverTable)
        .where('pid', imageCacheId)
        .select();
      if (cachedImage && cachedImage.length === 1) {
        res.contentType('jpeg');
        res.end(cachedImage[0].image, 'binary');
        return;
      }

      const images = await knex(coverTable)
        .where('pid', pid)
        .select();
      if (!images || images.length !== 1) {
        return next({
          status: 404,
          title: 'Unknown image',
          detail: `No image with id ${pid}`,
          meta: {resource: location}
        });
      }
      const resizedImage = await sharp(images[0].image)
        .resize(parseInt(width, 10), parseInt(height, 10))
        .toBuffer();
      await knex(coverTable).insert({
        pid: imageCacheId,
        image: resizedImage,
        owner: images[0].owner
      });
      res.contentType('jpeg');
      res.end(resizedImage, 'binary');
    } catch (error) {
      next(error);
    }
  });
//
// POST /v1/image/
//
router.route('/').post(
  asyncMiddleware(async (req, res, next) => {
    const user = await getUser(req);
    if (!user) {
      return next({status: 403, title: 'User not logged in'});
    }

    const pid = uuid();
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
    await knex(coverTable).insert({
      pid,
      image: req.body,
      owner: user.openplatformId
    });
    res
      .status(201)
      .location(location)
      .json({
        links: {self: location},
        id: pid,
        data: `Created ${location}`
      });
  })
);

module.exports = router;
