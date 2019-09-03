'use strict';
require('@babel/polyfill');
require('@babel/register')({presets: ['@babel/preset-env']});

// Sharp needs to be required early, in order to prevent a conflict @see https://github.com/lovell/sharp/issues/843
require('sharp');

const config = require('./config');
const logger = require('server/logger');
const internal = require('server/internal-server');
const external = require('server/external-server');

const externalListener = external.listen(config.server.port, () => {
  logger.log.info('Public service runs', {
    hostname: config.server.hostname,
    status: 'Public service up',
    pid: process.pid,
    port: externalListener.address().port
  });
});

const internalListener = internal.listen(config.server.internalPort, () => {
  logger.log.info('Internal service runs', {
    hostname: config.server.hostname,
    status: 'Internal service up',
    pid: process.pid,
    port: internalListener.address().port
  });
});
