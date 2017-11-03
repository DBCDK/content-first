'use strict';
const config = require('server/config');
const logger = require('server/logger');
const express = require('express');
const internal = express();
const parser = require('body-parser');
const helmet = require('helmet');

internal.use(parser.json({
  type: 'application/json',
  // Allow lone values.
  strict: false
}));

internal.use(parser.raw({
  type: 'image/*'
}));

internal.use(helmet());

internal.get('/crash', (req, res, next) => { // eslint-disable-line no-unused-vars
  if (config.server.environment !== 'production') {
    throw new Error('Deliberate water landing');
  }
  next();
});

// API routes.  Should agree with constants.apiversion.
const internalRoutes = require('server/internal-v1');
internal.use('/v1', internalRoutes);

// Error handlers.
internal.use((req, res, next) => {
  next({
    status: 404,
    title: 'Unknown endpoint',
    meta: {resource: req.path}
  });
});

internal.use((err, req, res, next) => {
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
internal.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
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

module.exports = internal;
