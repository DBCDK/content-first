'use strict';

import {getTaxonomy} from '../shared/taxonomy.requester';

const express = require('express');
const router = express.Router({mergeParams: true});
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const tagTable = constants.tags.table;
const logger = require('server/logger');
const IDMapper = require('__/services/idmapper');
const idmapper = new IDMapper(config, logger);

let usedTags = null;

async function getTagsFromTaxonomy() {
  if (usedTags) {
    return usedTags;
  }

  const taxonomy = getTaxonomy();
  const result = await knex(tagTable)
    .where('tag', '>', 0)
    .select(knex.raw('array_agg(distinct tag) as tags'));
  if (result[0] && result[0].tags) {
    usedTags = result[0].tags.map(tag => taxonomy[tag]);
    return usedTags;
  }
  return [];
}

async function suggest(q) {
  const tags = getTagsFromTaxonomy();
  if (!q) {
    return tags;
  }
  const tokens = q.toLowerCase().split(' ');
  return tags.filter(tag => {
    const list = tag.title.split(' ');
    return (
      tokens.filter(
        word => list.filter(w => w.toLowerCase().indexOf(word) === 0).length > 0
      ).length === tokens.length
    );
  });
}

router
  .route('/suggest')
  //
  // GET /v1/tags/:pid
  //
  .get(async (req, res, next) => {
    try {
      const tags = await suggest(req.query.q);
      res.status(200).json({
        data: {tags}
      });
    } catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error.message
      });
    }
  });

router
  .route('/:pid')
  //
  // GET /v1/tags/:pid
  //
  .get(async (req, res, next) => {
    const pid = req.params.pid;
    const location = `${req.baseUrl}/${pid}`;
    let tags;
    const workPids = (await idmapper.pidToWorkPids([pid]))[pid];
    try {
      tags = await knex(tagTable)
        .whereIn('pid', workPids)
        .select(['tag as id', 'score']);
    } catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
    if (!tags) {
      return res.status(200).json({
        data: {pid, tags: []},
        links: {self: location}
      });
    }

    res.status(200).json({
      data: {
        pid,
        tags: tags.map(tag => {
          tag.score = parseFloat(tag.score);
          return tag;
        })
      },
      links: {self: location}
    });
  });

module.exports = router;
