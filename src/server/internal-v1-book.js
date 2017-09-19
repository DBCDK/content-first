'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;
const bookUtil = require('server/books');
const validatingInput = require('server/json-verifiers').validatingInput;

router.route('/:pid')
  .put(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'Books have to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    try {
      await validatingInput(req.body, 'schemas/book-in.json');
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
      try {
        const existing = await knex(bookTable).where({pid}).select('pid');
        if (existing.length === 0) {
          await knex(bookTable).insert(spiked);
          res.status(201).location(location).json({
            data: spiked,
            links: {
              self: location,
              cover: `/v1/image/${pid}`
            }
          });
        }
        else {
          await knex(bookTable).where({pid}).update(spiked);
          res.status(200).location(location).json({
            data: spiked,
            links: {
              self: location,
              cover: `/v1/image/${pid}`
            }
          });
        }
      }
      catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: location}
        });
      }
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed book data',
        detail: 'Book data does not adhere to schema',
        meta: error.meta || error
      });
    }
  }))
;

module.exports = router;
