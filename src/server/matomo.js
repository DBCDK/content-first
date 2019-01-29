'use strict';

const config = require('server/config');
const logger = require('server/logger');

const MatomoClient = require('__/services/matomo');

module.exports = new MatomoClient(
  config.matomo.url,
  config.matomo.siteId,
  logger
);
