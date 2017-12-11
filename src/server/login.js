'use strict';

const config = require('server/config');
const logger = require('server/logger');
const Login = require('__/services/hejmdal/login-hejmdal');
module.exports = new Login(config.login, logger);
