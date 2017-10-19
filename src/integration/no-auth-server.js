'use strict';

// Simulate a non-reachable authentication service.
process.env.AUTH_URL = 'https://auth.exists.not';

// And after that require the server so that it uses the mock.
module.exports = {
  server: require('server/external-server')
};
