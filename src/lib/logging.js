'use strict';

/*
 * Logger module for a service.
 *
 * @param {config} Settings object of the form
 * {
 *   environment: (a string),
 *   level: (one of 'off', 'error', 'warn', 'info', 'debug', 'trace'),
 *   pretty: (0 or 1),
 *   hostname: (a string)
 * }
 * Usually set to server/config.logger.
*/

module.exports = config => {

  const PRETTY_PRINT = config.pretty === '1' ? 2 : null;
  let info = null;
  /**
   * Set additional info that should be visible in log messages
   *
   * @param {object} additionalInfo
   */
  function setInfo(additionalInfo) {
    if (typeof additionalInfo !== 'object' || Array.isArray(additionalInfo)) {
      throw new Error('Object was expected but got something else');
    }

    info = Object.assign(additionalInfo, {});
  }

  const log = {
    log: doLog,
    info: (msg, args) => doLog('info', msg, args),
    warn: (msg, args) => doLog('warn', msg, args),
    error: (msg, args) => doLog('error', msg, args),
    debug: (msg, args) => doLog('debug', msg, args),
    trace: (msg, args) => doLog('trace', msg, args)
  };

  /**
   * @returns current log level
   */
  function getCurrentLogLevel() {
    return config.level;
  }

  /**
   * Convert a log level name to a corresponding numerical value
   *
   * @param logLevel log level to convert
   * @returns numerical log level
   */
  function getNumericalLogLevel(logLevel) {
    const logLevels = {
      OFF: 0,
      ERROR: 1,
      WARN: 2,
      WARNING: 2,
      INFO: 3,
      DEBUG: 4,
      TRACE: 5
    };

    return logLevels[logLevel.toUpperCase()];
  }

  /**
   * Log as JSON to stdout
   *
   * @param {string} level log level
   * @param {string} msg message to log
   * @param {object} args map of additional key/values to log
   */
  function doLog(level, msg, args = {}) {
    const currentNumericalLogLevel = getNumericalLogLevel(getCurrentLogLevel());
    const targetNumericalLogLevel = getNumericalLogLevel(level);

    if (currentNumericalLogLevel < targetNumericalLogLevel) {
      return; // level low, do nothing
    }

    const blob = {
      '@timestamp': (new Date()).toISOString(),
      '@version': 1,
      level: level.toUpperCase(),
      host: config.hostname,
      pid: process.pid,
      env: config.environment
    };

    if (info) {
      Object.assign(blob, info);
    }

    if (msg) {
      blob.msg = msg;
    }

    console.log(JSON.stringify(Object.assign(blob, args), null, PRETTY_PRINT)); // eslint-disable-line no-console
  }

  return {
    setInfo,
    log,
    getCurrentLogLevel
  };
};
