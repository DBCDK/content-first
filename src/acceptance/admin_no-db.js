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
const {expectValidate} = require('./output-verifiers');

describe('Admin API', () => {
  describe('No database connection', () => {
    beforeEach(() => {
      mock.beforeEach();
    });
    afterEach(() => {
      mock.afterEach();
    });
    const webapp = request(mock.server);

    describe('/howru', () => {

      it('should say that database is unreachable', () => {
        // Arrange.
        nock(config.auth.url).get(constants.apiHealth).reply(200, constants.healthyResponse);
        // Act.
        return webapp.get('/howru')
          .set('Accept', 'application/json')
          // Assert.
          .expect(200)
          .expect(res => {
            expectValidate(res.body, 'schemas/status-out.json');
            expect(res.body.ok).to.be.false;
            expect(res.body).to.have.property('errorText');
            expect(res.body.errorText).to.match(/database.+unreachable/i);
            expect(res.body).to.have.property('errorLog');
            expect(mock.getErrorLog().args).to.have.length(0);
          });
      });
    });
  });
});
