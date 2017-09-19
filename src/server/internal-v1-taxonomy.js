'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const validatingInput = require('server/json-verifiers').validatingInput;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const topTable = constants.taxonomy.topTable;
const middleTable = constants.taxonomy.middleTable;
const bottomTable = constants.taxonomy.bottomTable;
const _ = require('lodash');

class IdChecker {
  constructor () {
    this.problems = [];
    this.ids = [];
  }
  getProblems () {
    return this.problems;
  }
  checkId (x) {
    const id = parseInt(x, 10);
    if (_.isNaN(id)) {
      this.problems.push(`Cannot convert ${x} to an integer`);
      return;
    }
    if (_.includes(this.ids, id)) {
      this.problems.push(`Id ${id} occurs more than once`);
      return;
    }
    this.ids.push(id);
  }
}

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
    const taxonomy = req.body;
    const idChecker = new IdChecker();
    taxonomy.forEach(top => {
      idChecker.checkId(top.id);
      top.items.forEach(middle => {
        idChecker.checkId(middle.id);
        middle.items.forEach(bottom => {
          idChecker.checkId(bottom.id);
        });
      });
    });
    if (idChecker.getProblems().length !== 0) {
      return next({
        status: 400,
        title: 'Malformed taxonomy',
        detail: 'Ids must be unique integers',
        meta: {problems: idChecker.getProblems()}
      });
    }
    const location = `${req.baseUrl}`;
    try {
      // Overwrite everything.
      await knex.raw(`truncate table ${bottomTable}, ${middleTable}, ${topTable} cascade`);
      for (let top of taxonomy) {
        await knex(topTable).insert({id: top.id, title: top.title});
        for (let middle of top.items) {
          await knex(middleTable).insert({id: middle.id, top: top.id, title: middle.title});
          for (let bottom of middle.items) {
            await knex(bottomTable).insert({id: bottom.id, middle: middle.id, title: bottom.title});
          }
        }
      }
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
