'use strict';

const config = require('server/config');
const Community = require('__/service/community/community');
const logger = require('server/logger');
module.exports = new Community(config.community, logger);
