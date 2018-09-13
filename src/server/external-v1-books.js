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
      const failed = _.difference(pids, books.map(b => b.pid));
      res.status(200).json({
        data: _.map(books, bookToSelfSufficientDataElement),
        failed: failed.length > 0 ? failed : void 0,
        links: {self: link}
      });
    })
  )
  .post(
    asyncMiddleware(async (req, res, next) => {
      // console.log(req.body.pids);
      const pids = parameters.parseList(req.body.pids);
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
      const failed = _.difference(pids, books.map(b => b.pid));
      res.status(200).json({
        data: _.map(books, bookToSelfSufficientDataElement),
        failed: failed.length > 0 ? failed : void 0,
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
