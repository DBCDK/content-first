'use strict';

const config = require('server/config');
const logger = require('server/logger');

const Searcher = require('__/services/searcher');

module.exports = new Searcher(config, logger);
