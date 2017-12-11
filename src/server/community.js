'use strict';

const config = require('server/config');
const Community = require('__/services/elvis/community');
const logger = require('server/logger');
module.exports = new Community(config.community, logger);
