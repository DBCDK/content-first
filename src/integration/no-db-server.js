'use strict';

// Simulate a non-reachable database.
process.env.PORT = 5640;
process.env.DB_HOST = 'db.exists.not';

// And after that require the server so that it uses the mock.
module.exports = {
  server: require('server/external-server')
};
