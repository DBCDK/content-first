'use strict';

const config = require('server/config');
const logger = require('server/logger');

const Suggester = require('__/services/suggester');

module.exports = new Suggester(config, logger);
