'use strict';

const config = require('./config');
const logger = require('__/logging')(config.logger);
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
