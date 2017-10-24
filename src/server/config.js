'use strict';

const tcp = require('__/tcp');
const hostname = require('os').hostname;
const knexfile = require('./knexfile');

// This is the only place to read process.env settings.  The point is that the
// servive should use the configuration like
//
//     const config = require('server/config')
//
// and just extract needed configuration parts and pass them on to modules that
// need them, like
//
//     mymodule(config.logger)
//
// or alternatively
//
//     const port = require('server/config').server.port
//     mymodule(port)

function Defaults () {
  return {
    environment: process.env.NODE_ENV || 'development',
    port: tcp.normalizePort(process.env.PORT) || 3001,
    internalPort: tcp.normalizePort(process.env.INTERNAL_PORT) || 3002,
    prettyLog: parseInt(process.env.PRETTY_LOG || 1, 10),
    logLevel: process.env.LOG_LEVEL || 'INFO',
    logServiceErrors: parseInt(process.env.LOG_SERVICE_ERRORS || 1, 10),
    hostname: hostname().replace('.domain_not_set.invalid', '')
  };
}

const defaults = new Defaults();

/*
 * Configuration groups for various modules.
 */

exports.server = {
  environment: defaults.environment,
  logServiceErrors: defaults.logServiceErrors,
  port: defaults.port,
  internalPort: defaults.internalPort,
  hostname: 'content-first.demo.dbc.dk'
  // hostname: 'content-first.dbc.dk'
};

exports.logger = {
  environment: defaults.environment,
  level: defaults.logLevel,
  pretty: defaults.prettyLog,
  hostname: defaults.hostname
};

exports.auth = {
  id: process.env.AUTH_CLIENT_ID || 'content-first',
  secret: process.env.AUTH_CLIENT_SECRET,
  url: process.env.AUTH_URL || 'https://auth.dbc.dk',
  apiHealth: '/health',
  apiGetToken: '/oauth/token'
};

exports.db = knexfile[defaults.environment];
