'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const tagTable = constants.tags.table;
const tagsUtil = require('server/tags');
const path = require('path');
const {validatingInput, validatingInputs} = require('__/json');
const schemaTags = path.join(__dirname, 'schemas/tags-in.json');
const schemaTagsArray = path.join(__dirname, 'schemas/tags-array-in.json');
const _ = require('lodash');

router
  .route('/')
  //
  // POST /v1/tags
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'Tags have to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      try {
        await validatingInput(req.body, schemaTagsArray);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed tags data',
          detail: 'Tags data does not adhere to schema',
          meta: error.meta || error
        });
      }
      let tagsArray;
      try {
        tagsArray = await validatingInputs(req.body, schemaTags);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed tags data',
          detail: 'Tags data does not adhere to schema',
          meta: error.meta || error
        });
      }
      let totalTags = 0;
      try {
        await knex.transaction(transaction => {
          return tagsArray.reduce((prev, tags) => {
            return prev.then(() => {
              return tagsUtil.parsingTagsInjection(tags).then(meta => {
                const pid = meta.pid;
                const rawTable = _.map(meta.tags, tag => {
                  return {pid, tag: tag.id, score: tag.score};
                });
                totalTags += rawTable.length;
                return transaction.insert(rawTable).into(tagTable);
              });
            });
          }, transaction.raw(`truncate table ${tagTable}`));
        });
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          meta: error
        });
      }
      return res.status(200).json({
        data: `${totalTags} tags for ${tagsArray.length} PIDs created`,
        links: {self: '/v1/tags'}
      });
    })
  )
  //
  // POST /v1/tags
  //
  .post(
    asyncMiddleware(async (req, res, next) => {
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'Tags have to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      let meta;
      try {
        meta = await tagsUtil.parsingTagsInjection(req.body);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed tags data',
          detail: 'Tags data does not adhere to schema',
          meta: error.meta || error
        });
      }
      const pid = meta.pid;
      const location = `${req.baseUrl}/${pid}`;
      let existingRaw;
      try {
        existingRaw = await knex(tagTable)
          .where({pid})
          .select(['tag as id', 'score']);
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: location}
        });
      }
      const existing = _.map(existingRaw, obj => {
        return {id: obj.id, score: parseFloat(obj.score)};
      });
      const missing = _.difference(meta.tags, existing);
      const rawTable = _.map(missing, tag => {
        return {pid, tag: tag.id, score: tag.score};
      });
      await knex(tagTable).insert(rawTable);
      const tags = _.union(meta.tags, existing);
      res
        .status(201)
        .location(location)
        .json({
          data: {pid, tags},
          links: {self: location}
        });
    })
  );

router
  .route('/:pid')
  //
  // POST /v1/tags/:pid
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const pid = req.params.pid;
      const location = `${req.baseUrl}/${pid}`;
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'Tags have to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      let meta;
      try {
        meta = await tagsUtil.parsingTagsInjection(req.body);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed tags data',
          detail: 'Tags data does not adhere to schema',
          meta: error.meta || error
        });
      }
      if (meta.pid !== pid) {
        return next({
          status: 400,
          title: 'Mismatch beetween PID and location',
          detail: `Expected PID ${pid} but found ${meta.pid}`,
          meta: {resource: location}
        });
      }
      try {
        await knex(tagTable)
          .where('pid', pid)
          .del();
        const rawTable = _.map(meta.tags, tag => {
          return {pid, tag: tag.id, score: tag.score};
        });
        await knex(tagTable).insert(rawTable);
        res
          .status(200)
          .location(location)
          .json({
            data: {pid, tags: meta.tags},
            links: {self: location}
          });
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: location}
        });
      }
    })
  )
  //
  // DELETE /v1/tags/:pid
  //
  .delete(
    asyncMiddleware(async (req, res, next) => {
      const pid = req.params.pid;
      const location = `${req.baseUrl}/${pid}`;
      try {
        await knex(tagTable)
          .where('pid', pid)
          .del();
        res.status(204).send();
      } catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: location}
        });
      }
    })
  );

module.exports = router;
