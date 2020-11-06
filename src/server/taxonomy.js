'use strict';

const config = require('server/config');
const logger = require('server/logger');

const Taxonomy = require('../lib/services/taxonomy');

module.exports = new Taxonomy(config, logger);
