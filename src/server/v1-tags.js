'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const tagTable = constants.tags.table;
const tagsUtil = require('server/tags');
const _ = require('lodash');

router.route('/')
  .post(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'Tags have to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    try {
      const meta = await tagsUtil.parsingTagsInjection(req.body);
      const pid = meta.pid;
      const location = `${req.baseUrl}/${pid}`;
      try {
        const existingRaw = await knex(tagTable).where({pid}).select('tag');
        const existing = _.map(existingRaw, obj => {
          return obj.tag;
        });
        const missing = _.difference(meta.tags, existing);
        for (let tag of missing) {
          await knex(tagTable).insert({pid: meta.pid, tag});
        }
        const tags = _.union(meta.tags, existing);
        res.status(201).location(location).json({
          data: {pid, tags},
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
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed tags data',
        detail: 'Tags data does not adhere to schema',
        meta: error.meta || error
      });
    }
  }))
;

router.route('/:pid')
  .get(asyncMiddleware(async (req, res, next) => {
    const pid = req.params.pid;
    const location = `${req.baseUrl}/${pid}`;
    try {
      const rawTags = await knex(tagTable).where({pid}).select('tag');
      const tags = _.map(rawTags, obj => {
        return obj.tag;
      });
      res.status(200).json({
        data: {pid, tags},
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
  .delete(asyncMiddleware(async (req, res, next) => {
    const pid = req.params.pid;
    const location = `${req.baseUrl}/${pid}`;
    try {
      await knex(tagTable).where('pid', pid).del();
      res.status(204).send();
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
