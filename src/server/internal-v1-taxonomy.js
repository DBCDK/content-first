'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const validatingInput = require('server/json-verifiers').validatingInput;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const taxonomyUtil = require('server/taxonomy');
const topTable = constants.taxonomy.topTable;
const middleTable = constants.taxonomy.middleTable;
const bottomTable = constants.taxonomy.bottomTable;

router.route('/')
  .put(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'Taxonomy has to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    try {
      await validatingInput(req.body, 'schemas/taxonomy-in.json');
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed taxonomy',
        detail: 'Taxonomy does not adhere to schema',
        meta: error.meta || error
      });
    }
    let taxonomy;
    try {
      taxonomy = await taxonomyUtil.parsingTaxonomyInjection(req.body);
    }
    catch (problems) {
      return next({
        status: 400,
        title: 'Malformed taxonomy',
        detail: 'Ids must be unique integers',
        meta: {problems}
      });
    }
    const location = `${req.baseUrl}`;
    try {
      // Overwrite everything.
      await knex.raw(`truncate table ${bottomTable}, ${middleTable}, ${topTable} cascade`);
      const topRawInsert = [];
      const middleRawInsert = [];
      const bottomRawInsert = [];
      for (let top of taxonomy) {
        topRawInsert.push({id: top.id, title: top.title});
        for (let middle of top.items) {
          middleRawInsert.push({id: middle.id, top: top.id, title: middle.title});
          for (let bottom of middle.items) {
            bottomRawInsert.push({id: bottom.id, middle: middle.id, title: bottom.title});
          }
        }
      }
      await knex(topTable).insert(topRawInsert);
      await knex(middleTable).insert(middleRawInsert);
      await knex(bottomTable).insert(bottomRawInsert);
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
      data: taxonomy,
      links: {self: location}
    });
  }))
;

module.exports = router;
