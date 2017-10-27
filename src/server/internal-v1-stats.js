'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const userTable = constants.users.table;
const cookieTable = constants.cookies.table;
const bookTable = constants.books.table;

router.route('/')
  //
  // GET /v1/stats
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const location = req.baseUrl;
    let users, cookies, books;
    try {
      users = await knex(userTable).count();
      // Cleanup dead sessions.
      const now_s = Math.ceil(Date.now() / 1000);
      await knex(cookieTable).where('expires_epoch_s', '<=', now_s).del();
      cookies = await knex(cookieTable).count();
      books = await knex(bookTable).count();
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
    res.status(200).json({
      data: {
        users: {
          total: parseInt(users[0].count, 10),
          'loged-in': parseInt(cookies[0].count, 10)
        },
        books: {
          total: parseInt(books[0].count, 10)
        }
      },
      links: {self: location}
    });
  }))
;

module.exports = router;
