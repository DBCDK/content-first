'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;

router
  .route('/')
  //
  // GET /v1/stats
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const statistics = new Statistics();
      try {
        await statistics.calculatingStats();
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: req.baseUrl}
        });
      }
      res.status(200).json({
        data: statistics.constructStatsStructure(),
        links: {self: req.baseUrl}
      });
    })
  );

/**
 * Statistics class
 *
 */
class Statistics {
  async calculatingStats() {
    await this.calculatingBookStats();
  }

  constructStatsStructure() {
    return {
      books: {
        total: this.books
      }
    };
  }

  async calculatingBookStats() {
    this.books = this.extractCountFromDbResultArray(
      await knex(bookTable).count()
    );
  }

  extractCountFromDbResultArray(table) {
    return parseInt(table[0].count, 10);
  }
}

module.exports = router;
