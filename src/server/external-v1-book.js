'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;

router.route('/:pid')
  //
  // GET /v1/book/:pid
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const pid = req.params.pid;
    const location = `${req.baseUrl}/${pid}`;
    const books = await knex(bookTable).where('pid', pid).select();
    if (books.length !== 1) {
      return next({
        status: 404,
        title: 'Unknown PID',
        detail: `PID ${pid} was not found`,
        meta: {resource: location}
      });
    }
    res.status(200).json({
      data: books[0],
      links: {
        self: location,
        cover: `/v1/image/${pid}`
      }
    });
  }))
;

module.exports = router;
