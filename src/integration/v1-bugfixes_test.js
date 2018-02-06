/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const request = require('supertest');
const {expectSuccess_ListsSeededOnTestStart} = require('./test-commons');

describe('Complex interactions', () => {
  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity();
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  it('PUT /shortlist should not interact with other lists', () => {
    return webapp
      .put('/v1/shortlist')
      .set('cookie', 'login-token=a-valid-login-token')
      .type('application/json')
      .send([])
      .expect(200)
      .then(() => {
        return webapp
          .get('/v1/lists')
          .set('cookie', 'login-token=a-valid-login-token')
          .expect(expectSuccess_ListsSeededOnTestStart);
      });
  });
});
