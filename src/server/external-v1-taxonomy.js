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

router.route('/')
  //
  // GET /v1/taxonomy
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const location = `${req.baseUrl}`;
    try {
      const topResult = await knex(topTable).select(['id', 'title']);
      res.status(200).json({
        data: topResult,
        links: {self: location}
      });
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
  }))
;

router.route('/:id')
  //
  // GET /v1/taxonomy/:id
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const location = `${req.baseUrl}/${id}`;
    if (_.isNaN(id)) {
      return next({
        status: 400,
        title: 'Unknown tag',
        detail: `${req.params.id} is not a tag id`,
        meta: {resource: location}
      });
    }
    try {
      let children = await knex(middleTable).where('top', id).select(['id', 'title']);
      if (children.length === 0) {
        children = await knex(bottomTable).where('middle', id).select(['id', 'title']);
        if (children.length === 0) {
          const exists = await knex(bottomTable).where('id', id).select(['id']);
          if (exists.length === 0) {
            return next({
              status: 400,
              title: 'Unknown tag',
              detail: `${id} is not a tag id`,
              meta: {resource: location}
            });
          }
          return next({
            status: 400,
            title: 'Tag has no sublevel',
            detail: `tag ${id} has no children`,
            meta: {resource: location}
          });
        }
      }
      res.status(200).json({
        data: children,
        links: {self: location}
      });
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
  }))
;

module.exports = router;
