'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const {asyncMiddleware} = require('__/async-express');
const _ = require('lodash');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;
const parameters = require('__/parameters');

router
  .route('/')
  //
  // GET /v1/books
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const pids = parameters.parseList(req.query.pids);
      if (!pids || pids.length === 0) {
        return next({
          status: 400,
          title: 'PIDs expected',
          detail: 'You must supply at least one PID.'
        });
      }
      const link = `${req.baseUrl}?pids=${req.query.pids}`;
      const books = await knex(bookTable)
        .whereIn('pid', pids)
        .select();
      if (books.length !== pids.length) {
        return next({
          status: 404,
          title: 'Unknown PIDs',
          detail: 'Some PIDs were not found',
          meta: {pids, resource: link}
        });
      }
      res.status(200).json({
        data: _.map(books, bookToSelfSufficientDataElement),
        links: {self: link}
      });
    })
  );

function bookToSelfSufficientDataElement(bookFromDb) {
  return {
    book: bookFromDb,
    links: {
      self: `/v1/book/${bookFromDb.pid}`,
      cover: `/v1/image/${bookFromDb.pid}`
    }
  };
}

module.exports = router;
