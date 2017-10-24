'use strict';

const config = require('server/config');
const Authenticator = require('__/service/authentication-smaug');
module.exports = new Authenticator(config.auth);
