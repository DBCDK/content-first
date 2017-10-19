'use strict';

/*
 * Configuration
 */
const config = require('server/config');
const constants = require('server/constants')();

/*
 * Logging & stuff.
 */
const logger = require('__/logging')(config.logger);
const _ = require('lodash');

/**
 * Database wrapper.
 */
const Database = require('server/remote/database');
const database = new Database();

/*
 * Make sure database is at most recent schema.
 */
const knex = require('knex')(config.db);
knex.migrate.latest()
  .then(() => {
    logger.log.debug('Database is now at latest version.');
    database.setOk();
  })
  .catch(error => {
    logger.log.info(`Could not update database to latest version: ${error}`);
    database.logError(error);
  });

/**
 * Remote services.
 */
const Authenticator = require('server/remote/authentication');
const authenticator = new Authenticator();

/*
 * Public web server.
 */
const express = require('express');
const external = express();

/*
 * Static frontend content.
 */
const path = require('path');
const staticPath = path.join(__dirname, '..', '..', 'build');
external.use(express.static(staticPath));

/*
 * Securing headers.
 */
const helmet = require('helmet');
external.use(helmet());

/*
 * All request bodies must be JSON.
 */
const parser = require('body-parser');
external.use(parser.json({
  type: 'application/json',
  // Allow lone values.
  strict: false
}));

/*
 * Administrative API.
 */
external.get('/howru', async(req, res) => {
  const configWithoutSecrets = _.omit(config, [
    'db.connection.user',
    'db.connection.password',
    'auth.id',
    'auth.secret'
  ]);
  const services = [
    database,
    authenticator
  ];
  const serviceOk = await Promise.all(
    _.map(services, service => service.testingConnection())
  );
  const ok = _.every(serviceOk);
  if (ok) {
    return res.json({
      ok: true,
      version: require('../../package').version,
      'api-version': constants.apiversion,
      hostname: req.hostname,
      address: req.ip,
      config: configWithoutSecrets
    });
  }
  // Find all services that erred.
  const erred = _.filter(services, service => !service.isOk());
  res.json({
    ok: false,
    errorText: _.join(_.map(erred, service => service.getCurrentError())),
    errorLog: _.flatMap(erred, service => service.getErrorLog()),
    version: require('../../package').version,
    'api-version': constants.apiversion,
    hostname: req.hostname,
    address: req.ip,
    config: configWithoutSecrets
  });
});

external.get('/pid', (req, res) => {
  res.type('text/plain');
  res.send(process.pid.toString());
});

/*
 * API routes.  Should agree with constants.apiversion.
 */
const externalRoutes = require('server/external-v1');
external.use('/v1', externalRoutes);

/*
 * Let frontend React handle all other routes.
 */
external.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'));
});

/*
 * Error handlers.
 */
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
