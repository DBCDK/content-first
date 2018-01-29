'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const _ = require('lodash');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const bookTable = constants.books.table;
const tagTable = constants.tags.table;

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

class Statistics {
  async calculatingStats() {
    await this.calculatingCookieStats();
    await this.calculatingBookStats();
    this.calculateTagsStats(await this.countingTagsForEachPid());
  }

  constructStatsStructure() {
    return {
      users: {
        'logged-in': this.cookies
      },
      books: {
        total: this.books
      },
      tags: {
        total: this.tagsTotal,
        pids: this.tagsPids,
        min: this.tagsMin,
        max: this.tagsMax
      }
    };
  }

  async calculatingCookieStats() {
    await this.cleaningUpDeadSessions();
    this.cookies = this.extractCountFromDbResultArray(
      await knex(cookieTable).count()
    );
  }

  async calculatingBookStats() {
    this.books = this.extractCountFromDbResultArray(
      await knex(bookTable).count()
    );
  }

  calculateTagsStats(pidList) {
    this.tagsPids = pidList.length;
    this.tagsTotal = _.reduce(
      pidList,
      (sum, pidCount) => sum + parseInt(pidCount.count, 10),
      0
    );
    this.tagsMin = _.reduce(
      pidList,
      (min, pidCount) => Math.min(min, parseInt(pidCount.count, 10)),
      Number.MAX_SAFE_INTEGER
    );
    this.tagsMax = _.reduce(
      pidList,
      (max, pidCount) => Math.max(max, parseInt(pidCount.count, 10)),
      0
    );
  }

  cleaningUpDeadSessions() {
    const now_s = Math.ceil(Date.now() / 1000);
    return knex(cookieTable)
      .where('expires_epoch_s', '<=', now_s)
      .del();
  }

  countingTagsForEachPid() {
    return knex(tagTable)
      .select('pid', knex.raw('count(tags)'))
      .groupBy('pid');
  }

  extractCountFromDbResultArray(table) {
    return parseInt(table[0].count, 10);
  }
}

module.exports = router;
