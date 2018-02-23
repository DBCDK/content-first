'use strict';

const tcp = require('__/tcp');
const hostname = require('os').hostname;
const knexfile = require('./knexfile');

// This is the only place to read process.env settings.  The point is that the
// service should use the configuration like
//
//     const config = require('server/config')
//
// and just extract needed configuration parts and pass them on to modules that
// need the parts, like
//
//     mymodule(config.logger)
//
// or alternatively
//
//     const port = require('server/config').server.port
//     mymodule(port)

function Common() {
  return {
    environment: process.env.NODE_ENV || 'development',
    hostname: hostname().replace('.domain_not_set.invalid', ''),
    secret: process.env.AUTH_CLIENT_SECRET || 'something'
  };
}

const common = new Common();

/*
 * Configuration groups for various modules.
 */

exports.auth = {
  id: process.env.AUTH_CLIENT_ID || 'content-first',
  secret: common.secret,
  url: process.env.AUTH_URL || 'https://auth.dbc.dk'
};

exports.db = knexfile[common.environment];

exports.community = {
  url: process.env.COMMUNITY_URL || 'http://localhost:3003',
  name: process.env.COMMUNITY_NAME || 'Læsekompasset'
};

exports.logger = {
  environment: common.environment,
  level: process.env.LOG_LEVEL || 'INFO',
  pretty: parseInt(process.env.PRETTY_LOG || 1, 10),
  hostname: common.hostname
};

exports.login = {
  url: process.env.LOGIN_URL || 'https://login.bib.dk',
  openplatformUrl: process.env.OPENPLATFORM_URL || 'https://openplatform.dbc.dk'
};

exports.recompass = {
  url: process.env.RECOMPASS_URL
};

exports.server = {
  environment: common.environment,
  logServiceErrors: parseInt(process.env.LOG_SERVICE_ERRORS || 1, 10),
  port: tcp.normalizePort(process.env.PORT) || 3001,
  internalPort: tcp.normalizePort(process.env.INTERNAL_PORT) || 3002,
  hostname: 'content-first.demo.dbc.dk'
  // hostname: 'content-first.dbc.dk'
};
