'use strict';

const config = require('server/config');
const logger = require('server/logger');

const RecompasWork = require('__/services/recompas-work');
const RecompasTags = require('__/services/recompas-tags');

module.exports = {
  recompasTags: new RecompasTags(config, logger),
  recompasWork: new RecompasWork(config, logger)
};
