'use strict';

const config = require('server/config');
const logger = require('server/logger');
const Recompas = require('__/services/recompas');
module.exports = new Recompas(config, logger);
