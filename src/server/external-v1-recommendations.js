'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const _ = require('lodash');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;
const tagTable = constants.tags.table;
const parameters = require('__/parameters');

router
  .route('/')
  //
  // GET /v1/recommendations
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const tags = parameters.parseList(req.query.tags);
      const link = `${req.baseUrl}?tags=${req.query.tags}`;
      if (!tags || tags.length === 0) {
        return next({
          status: 400,
          title: 'Tags expected',
          detail: 'You must supply at least one tag number.',
          meta: {resource: link}
        });
      }
      try {
        // Select all PIDs that have all the specified tags.
        // (eg. select pid from tags where tag in (46,49) group by pid having count(*) > 2;)
        const pidsList = await knex(tagTable)
          .select('pid')
          .whereIn('tag', tags)
          .groupBy('pid')
          .having(knex.raw(`count(*) >= ${tags.length}`));
        const pids = _.map(pidsList, obj => {
          return obj.pid;
        });
        const books = await knex(bookTable)
          .whereIn('pid', pids)
          .select();
        res.status(200).json({
          data: _.map(books, bookToSelfSufficientDataElement),
          links: {self: link}
        });
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: link}
        });
      }
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
