'use strict';

const express = require('express');
const router = express.Router();
const config = require('server/config');
// const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const constants = require('server/constants')();

router.route('/')

  .get((req, res, next) => {
    knex(constants.table).select()
      .then(names => {
        res.status(200).json({
          links: {self: req.baseUrl},
          data: names
        });
      })
      .catch(error => {
        next(error);
      });
  })

  .post((req, res, next) => {
    knex(constants.table).insert(req.body, '*')
      .then(names => {
        const name = names[0];
        const location = `${req.baseUrl}/${name.id}`;
        res.status(201).location(location).json({
          links: {self: location},
          data: name
        });
      })
      .catch(error => {
        next(error);
      });
  });

module.exports = router;
