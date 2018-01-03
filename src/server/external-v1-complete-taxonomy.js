'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const topTable = constants.taxonomy.topTable;
const middleTable = constants.taxonomy.middleTable;
const bottomTable = constants.taxonomy.bottomTable;
const _ = require('lodash');

router
  .route('/')
  //
  // GET /v1/complete-taxonomy
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const location = `${req.baseUrl}`;
      let topResult;
      let middleResult;
      let bottomResult;
      try {
        // There is possibly some postgresql-fu way of doing this in one go,
        // but atm the taxonomy is recreated directly in JS.
        topResult = await knex(topTable).select();
        middleResult = await knex(middleTable).select();
        bottomResult = await knex(bottomTable).select();
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: location}
        });
      }
      let response = [];
      topResult.forEach(top => {
        let middleLayer = [];
        _.filter(middleResult, middle => {
          return middle.top === top.id;
        }).forEach(middle => {
          let bottomLayer = [];
          _.filter(bottomResult, bottom => {
            return bottom.middle === middle.id;
          }).forEach(bottom => {
            bottomLayer.push({id: bottom.id, title: bottom.title});
          });
          middleLayer.push({
            id: middle.id,
            title: middle.title,
            items: bottomLayer
          });
        });
        response.push({
          id: top.id,
          title: top.title,
          items: middleLayer
        });
      });
      res.status(200).json({
        data: response,
        links: {self: location}
      });
    })
  );

module.exports = router;
