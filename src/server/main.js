'use strict';

const config = require('./config');
const server = require('./index');
const logger = require('__/logging')(config.logger);

const serverListener = server.listen(config.server.port, () => {
  logger.log.info('Service runs', {
    status: 'Service up',
    pid: process.pid,
    port: serverListener.address().port
  });
});
