'use strict';

const config = require('server/config');
const Login = require('__/service/login-hejmdal');
module.exports = new Login(config.login);
