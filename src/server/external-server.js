'use strict';

const config = require('server/config');
const constants = require('server/constants')();
const logger = require('server/logger');
const _ = require('lodash');

// Remote services.
const database = require('server/database');
const authenticator = require('server/authenticator');
const login = require('server/login');
const generatingServiceStatus = require('__/service/service-status');

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
external.use(parser.json({
  type: 'application/json',
  // Allow lone values.
  strict: false
}));

// Auto-parse cookies.
const cookieParser = require('cookie-parser');
external.use(cookieParser());

// Administrative API.
external.get('/howru', async(req, res) => {
  const configWithoutSecrets = _.omit(config, [
    'db.connection.user',
    'db.connection.password',
    'auth.id',
    'auth.secret'
  ]);
  const services = [
    database,
    authenticator,
    login
  ];
  const status = await generatingServiceStatus(services);
  Object.assign(status, {
    version: require('../../package').version,
    'api-version': constants.apiversion,
    hostname: req.hostname,
    address: req.ip,
    config: configWithoutSecrets
  });
  res.json(status);
});

external.get('/pid', (req, res) => {
  res.type('text/plain');
  res.send(process.pid.toString());
});

// API routes.  Should agree with constants.apiversion.
external.use('/v1', require('server/external-v1'));
external.use('/hejmdal', require('server/external-hejmdal'));

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
  }
  else {
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
external.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  err.status = err.status || 500;
  let returnedError = {
    status: err.status,
    code: err.code || err.status.toString(),
    title: err.title || (err.message || 'Unknown error')
  };
  if (err.detail) {
    returnedError.detail = err.detail;
  }
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
