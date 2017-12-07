'use strict';

const config = require('server/config');
const Authenticator = require('__/service/smaug/authentication-smaug');
const logger = require('server/logger');
module.exports = new Authenticator(config.auth, logger);
