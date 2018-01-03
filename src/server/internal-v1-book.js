'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;
const bookUtil = require('server/books');
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/book-in.json');

router
  .route('/:pid')
  //
  // PUT /v1/book/:pid
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'Books have to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      try {
        await validatingInput(req.body, schema);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed book data',
          detail: 'Book data does not adhere to schema',
          meta: error.meta || error
        });
      }
      const pid = req.params.pid;
      if (req.body.pid !== pid) {
        return next({
          status: 400,
          title: 'Mismatch beetween book pid and location',
          detail: `Expected PID ${pid} but found ${req.body.pid}`
        });
      }
      const meta = await bookUtil.parsingMetaDataInjection(req.body);
      const spiked = bookUtil.transformMetaDataToBook(meta);
      const location = `${req.baseUrl}/${pid}`;
      let existing;
      try {
        existing = await knex(bookTable)
          .where({pid})
          .select('pid');
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: location}
        });
      }
      if (existing.length === 0) {
        await knex(bookTable).insert(spiked);
        res
          .status(201)
          .location(location)
          .json({
            data: spiked,
            links: {
              self: location,
              cover: `/v1/image/${pid}`
            }
          });
      } else {
        await knex(bookTable)
          .where({pid})
          .update(spiked);
        res
          .status(200)
          .location(location)
          .json({
            data: spiked,
            links: {
              self: location,
              cover: `/v1/image/${pid}`
            }
          });
      }
    })
  );

module.exports = router;
