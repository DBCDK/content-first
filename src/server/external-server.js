'use strict';

const config = require('server/config');
const constants = require('server/constants')();
const logger = require('server/logger');
const _ = require('lodash');
const {toLoggableString} = require('__/json');

// Remote services.
const database = require('server/database');
const authenticator = require('server/authenticator');
const login = require('server/login');
const community = require('server/community');
const recompas = require('server/recompas');
const generatingServiceStatus = require('__/services/service-status');

// Public web server.
const express = require('express');
const external = express();

// Static frontend content.
const path = require('path');
const staticPath = path.join(__dirname, '..', '..', 'build');
external.use(express.static(staticPath));

// Securing headers.
const helmet = require('helmet');
external.use(helmet());

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

// Auto-parse cookies.
const cookieParser = require('cookie-parser');
external.use(cookieParser());

// Detect visits from bots
// test bot visit with: querystring: {use: true,key: 'bot',value: '1'}
external.use(
  require('express-bot')({querystring: {use: true, key: 'bot', value: '1'}})
);

// Administrative API.
external.get('/howru', async (req, res) => {
  const configWithoutSecrets = _.omit(config, [
    'db.connection.user',
    'db.connection.password',
    'auth.id',
    'auth.secret',
    'login.salt'
  ]);
  const services = [authenticator, community, database, login, recompas];
  const status = await generatingServiceStatus(services);
  Object.assign(status, {
    version: require('../../package').version,
    'api-version': constants.apiversion,
    hostname: req.hostname,
    address: req.ip,
    config: configWithoutSecrets
  });
  if (!status.ok) {
    res.status(503);
  }
  res.json(status);
});

external.get('/pid', (req, res) => {
  res.type('text/plain');
  res.send(process.pid.toString());
});

// API routes.  Should agree with constants.apiversion.
external.use('/v1', require('server/external-v1'));
external.use('/hejmdal', require('server/external-hejmdal'));
external.use('/lister/:id', require('server/external-meta'));

// Let frontend React handle all other routes.
external.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'));
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
    title: err.title || (err.message || 'Unknown error'),
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
    logger.log.error(returnedError);
  }
  res.json({errors: [returnedError]});
});

module.exports = external;
