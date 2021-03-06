'use strict';
import {getTaxonomy} from '../shared/taxonomy.requester';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('server/config');
const constants = require('server/constants')();
const logger = require('server/logger');
const _ = require('lodash');
const {toLoggableString} = require('__/json');
const passport = require('server/passport');

// Remote services.
const database = require('server/database');
const authenticator = require('server/authenticator');
const login = require('server/login');
const {recompasTags, recompasWork} = require('server/recompas');
const suggester = require('server/suggester');
const searcher = require('server/searcher');
const matomo = require('server/matomo');
const Holdings = require('__/services/holdings');
const IDMapper = require('__/services/idmapper');
const generatingServiceStatus = require('__/services/service-status');
const isProduction = config.server.isProduction;
const holdings = new Holdings(config, logger);
const idmapper = new IDMapper(config, logger);

// Public web server.
const express = require('express');
const external = express();

// Log timings
external.use((req, res, next) => {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    logger.log.debug('timings', {baseUrl: req.baseUrl, ms: elapsedTimeInMs});
  });

  next();
});

const injectTaxonomy = (html, taxonomy) => {
  return html.replace(
    '</head>',
    `<script>TAXONOMY = ${JSON.stringify(taxonomy)};
    </script></head>`
  );
};
let indexHtmlWithConfig;
const buildPath = path.resolve(__dirname, '..', '..', 'build', 'index.html');
const devPath = path.resolve(__dirname, '..', '..', 'public', 'index.html');
if (fs.existsSync(buildPath)) {
  indexHtmlWithConfig = fs.readFileSync(buildPath, 'utf8');
} else {
  indexHtmlWithConfig = fs.readFileSync(devPath, 'utf8');
}
indexHtmlWithConfig = indexHtmlWithConfig.replace(
  '</head>',
  `<script>CONFIG = ${JSON.stringify({
    matomo: config.matomo,
    kiosk: config.kiosk,
    showNotice: config.showNotice
  })};</script></head>`
);

// Serve indexHtmlWithConfig on the root path.
// Needs to be done before setting up static files
external.get('/', async (req, res) => {
  res.send(injectTaxonomy(indexHtmlWithConfig, getTaxonomy()));
});

// Static frontend content.
const staticPath = path.join(__dirname, '..', '..', 'build');
external.use(express.static(staticPath));

// Securing headers.
const helmet = require('helmet');
external.use(helmet());

// add user object to the request. (For test-users in development mode)
if (!isProduction) {
  const cookieParser = require('cookie-parser');
  external.use(cookieParser());
  external.use((req, res, next) => {
    if (!req.user && req.cookies['test-user-data']) {
      const userData = JSON.parse(req.cookies['test-user-data']);
      req.user = userData;
    }
    next();
  });
}

matomo.trackDataEvent('info', {app: 'content-first', isProduction});

// Auto-parse request bodies in JSON format.
const parser = require('body-parser');
external.use(
  parser.json({
    type: 'application/json',
    // Allow lone values.
    strict: false
  })
);

external.use(
  parser.raw({
    type: 'image/jpeg',
    limit: '10mb'
  })
);

// set up passport
const session = require('cookie-session');
external.use(session({secret: config.auth.secret, signed: isProduction}));
external.use(passport.initialize());
external.use(passport.session());

// Detect visits from bots
// test bot visit with: querystring: {use: true,key: 'bot',value: '1'}
external.use(
  require('./bot/bot-detect.js')({
    querystring: {use: true, key: 'bot', value: '1'}
  })
);

// Administrative API.
// Indicates that app is ready for test
external.get('/ready', async (req, res) => {
  const services = [database];
  const status = await generatingServiceStatus(services);
  Object.assign(status, {
    version: require('../../package').version,
    'api-version': constants.apiversion,
    hostname: req.hostname,
    address: req.ip
  });
  if (!status.ok) {
    res.status(503);
    logger.log.error('GET admin data for test - error', {
      errorMessage: JSON.stringify(status)
    });
  }
  res.json(status);
});

// Administrative API.
external.get('/howru', async (req, res) => {
  const configWithoutSecrets = _.omit(config, [
    'db.connection.user',
    'db.connection.password',
    'auth.id',
    'auth.secret',
    'login.salt'
  ]);
  const services = [
    authenticator,
    database,
    login,
    recompasTags,
    recompasWork,
    suggester,
    searcher,
    holdings,
    idmapper
  ];
  const status = await generatingServiceStatus(services);
  Object.assign(status, {
    version: require('../../package').version,
    'api-version': constants.apiversion,
    hostname: req.hostname,
    address: req.ip,
    config: configWithoutSecrets
  });
  try {
    status.taxonomySHA256 = crypto
      .createHash('sha256')
      .update(JSON.stringify(require('../data/exportTaxonomy.json')))
      .digest('hex');
  } catch (e) {
    status.taxonomySHA256 = '';
  }
  if (!status.ok) {
    res.status(503);
    logger.log.error('no permissions - error', {
      errorMessage: JSON.stringify(status)
    });
  }
  res.json(status);
});

external.get('/pid', (req, res) => {
  res.type('text/plain');
  res.send(process.pid.toString());
});

// API routes.  Should agree with constants.apiversion.
external.use('/v1', require('server/external-v1'));
external.use('/lister/:id', require('server/external-meta-list'));
external.use(
  '/' + encodeURIComponent('værk') + '/:pid',
  require('server/external-meta-work')
);

// Let frontend React handle all other routes.
external.get('*', async (req, res) => {
  res.send(injectTaxonomy(indexHtmlWithConfig, getTaxonomy()));
});

// Error handlers.
external.use((req, res, next) => {
  next({
    status: 404,
    title: 'Unknown endpoint',
    meta: {resource: req.path}
  });
});

external.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    next({
      status: err.status,
      title: 'Malformed body',
      detail: 'JSON syntax error',
      meta: {body: err.body}
    });
  } else {
    next(err);
  }
});

/*
 * General error handler.
 *
 * err properties supported (in accordance with http://jsonapi.org/format/#errors):
 * @param {status} HTTP status code to return.
 * @param {title} Stable identification of the error.
 * @param {detail} Detailed identification of the error.
 * @param {meta} Additional information.
 *
 * Additionally, in non-production mode, any stack trace and other properties
 * from err are included.
 */
// eslint-disable-next-line no-unused-vars
external.use((err, req, res, next) => {
  err.status = err.status || 500;
  let returnedError = {
    status: err.status,
    code: err.code || err.status.toString(),
    title: err.title || err.message || 'Unknown error',
    detail: err.detail || toLoggableString(err)
  };
  if (err.meta) {
    returnedError.meta = err.meta;
  }
  res.status(returnedError.status);
  if (config.server.environment !== 'production') {
    // More information for non-produciton.
    Object.assign(returnedError, err);
    if (err.stack) {
      returnedError.stack = err.stack;
    }
  }
  if (returnedError.status >= 500 && config.server.logServiceErrors === '1') {
    logger.log.error('unhandledRejection', {
      errorMessage: returnedError.detail,
      stack: returnedError.stack
    });
  }
  res.json({errors: [returnedError]});
});

module.exports = external;
