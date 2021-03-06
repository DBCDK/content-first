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
  url: process.env.AUTH_URL || 'https://auth.dbc.dk',
  configurationUrl:
    process.env.AUTH_CONFIGURATION_URL || 'https://auth-config.dbc.dk'
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
  openplatformUrl:
    process.env.OPENPLATFORM_URL || 'https://openplatform.dbc.dk/v3'
};

exports.recompass = {
  url: {
    tags: process.env.RECOMPASS_TAGS_URL,
    work: process.env.RECOMPASS_WORK_URL
  }
};

exports.matomo = {
  url: process.env.MATOMO_URL,
  siteId: process.env.MATOMO_SITE_ID,
  dataSiteId: process.env.MATOMO_DATA_SITE_ID,
  aid: process.env.MATOMO_AID
};

exports.suggester = {
  url: process.env.SUGGESTER_URL + '/api/suggest',
  status: process.env.SUGGESTER_URL + '/api/status'
};

exports.searcher = {
  url: process.env.SUGGESTER_URL + '/api/search',
  status: process.env.SUGGESTER_URL + '/api/status'
};

exports.server = {
  isProduction: common.environment === 'production',
  environment: common.environment,
  logServiceErrors: parseInt(process.env.LOG_SERVICE_ERRORS || 1, 10),
  port: tcp.normalizePort(process.env.PORT) || 3001,
  internalPort: tcp.normalizePort(process.env.INTERNAL_PORT) || 3002,
  hostname: 'laesekompas.dk',
  dmzHost: process.env.DMZ_HOST || 'https://laesekompas.dk'
};

exports.storage = {
  typeId: process.env.STORAGE_TYPE_ID,
  url: process.env.STORAGE_URL
};

exports.kiosk = {
  enabled: process.env.KIOSK_ENABLED ? true : false
};

exports.fors = {
  url: process.env.FORSRIGHTS_URL || 'https://forsrights.addi.dk/2.0/'
};

exports.test = {
  minismaug: {
    host: process.env.MINISMAUG_HOST || 'localhost'
  },
  user1: {
    username: process.env.TEST_USER_NAME_1,
    pincode: process.env.TEST_USER_PINCODE_1,
    uniqueId: process.env.TEST_USER_UNIQUE_ID_1
  },
  user2: {
    username: process.env.TEST_USER_NAME_2,
    pincode: process.env.TEST_USER_PINCODE_2,
    uniqueId: process.env.TEST_USER_UNIQUE_ID_2
  }
};

exports.holdings = {
  url:
    process.env.HOLDINGS_URL ||
    'http://cisterne.solr.dbc.dk:8983/solr/cisterne-laesekompas-holdings-lookup/select'
};

exports.idmapper = {
  url:
    process.env.IDMAPPER_URL || 'http://id-mapper-1-0.mi-prod.svc.cloud.dbc.dk'
};

exports.showNotice = process.env.SHOW_NOTICE || false;
