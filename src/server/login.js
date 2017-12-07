'use strict';

const config = require('server/config');
const logger = require('server/logger');
const Login = require('__/service/hejmdal/login-hejmdal');
module.exports = new Login(config.login, logger);
