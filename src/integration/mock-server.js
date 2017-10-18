'use strict';

const mockery = require('mockery');

// TODO: Mock Smaug.
// const mailer = require('nodemailer-mock');
// mockery.enable({warnOnUnregistered: false});
// mockery.registerMock('nodemailer', mailer);

// TODO: Mock Hejmdal.

// And after that require the server so that it uses the mocked versions
// instead of the real packages directly.
module.exports = {
  external: require('server/external-server'),
  internal: require('server/internal-server'),
  // mailer,
  afterEach: () => {
    // mailer.mock.reset();
  },
  after: () => {
    mockery.deregisterAll();
    mockery.disable();
  }
};
