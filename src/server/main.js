'use strict';

const config = require('./config');
const servers = require('./index');
const logger = require('__/logging')(config.logger);

const externalListener = servers.external.listen(config.server.port, () => {
  logger.log.info('Public service runs', {
    status: 'Public service up',
    pid: process.pid,
    port: externalListener.address().port
  });
});

const internalListener = servers.internal.listen(config.server.internalPort, () => {
  logger.log.info('Internal service runs', {
    status: 'Internal service up',
    pid: process.pid,
    port: internalListener.address().port
  });
});
