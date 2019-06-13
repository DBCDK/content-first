/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

// Must be first require to get the environment right.
const mock = require('./no-db-server');

const config = require('server/config');
const constants = require('__/services/smaug/authentication-constants')();
const {expect} = require('chai');
const request = require('supertest');
const nock = require('nock');
const {expectValidate} = require('fixtures/output-verifiers');

describe('Admin API', () => {
  describe('No database connection', () => {
    beforeEach(() => {
      mock.beforeEach();
    });

    afterEach(function() {
      if (this.currentTest.state !== 'passed') {
        mock.dumpLogs();
      }
    });

    const webapp = request(mock.server);

    describe('/howru', () => {
      it('should say that database is unreachable', () => {
        // Arrange.
        nock(config.auth.url)
          .get(constants.apiHealth)
          .reply(200, constants.healthyResponse);
        nock(config.recompass.url.tags)
          .get('/status')
          .reply(200, constants.healthyResponse);
        nock(config.recompass.url.work)
          .get('/status')
          .reply(200, constants.healthyResponse);
        nock(config.suggester.status)
          .get('')
          .reply(200, {ok: true});
        nock(config.searcher.status)
          .get('')
          .reply(200, {ok: true});
        // Act.
        return (
          webapp
            .get('/howru')
            .set('Accept', 'application/json')
            // Assert.
            .expect(503)
            .expect(res => {
              expectValidate(res.body, 'schemas/status-out.json');
              expect(res.body.ok).to.be.false;
              expect(res.body).to.have.property('errorText');
              expect(res.body.errorText).to.match(/database.+unreachable/i);
              expect(res.body).to.have.property('errorLog');
              expect(mock.getErrorLog().args).to.have.length(1);
            })
        );
      }).timeout(5000);
    });
  });
});
