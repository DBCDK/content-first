/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const request = require('supertest');
const nock = require('nock');
const {expect} = require('chai');
const {expectSuccess} = require('fixtures/output-verifiers');
const {expectFailure} = require('fixtures/output-verifiers');
const {
  arrangeCommunityServiceToRespondWithServerError_OnPost,
  expectError_MalformedInput_AdditionalProperties,
  expectError_CommunityConnectionProblem,
  expectError_WrongContentType
} = require('./test-commons');

describe.only('Roles', () => {
  const webapp = request(mock.internal);

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity();
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  //
  // POST /v1/role-add
  //
  describe('POST /v1/role-add', () => {
    const location = '/v1/role-add';

    it('should reject wrong content type', () => {
      return webapp
        .post(location)
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    it('should reject invalid content', () => {
      return webapp
        .post(location)
        .type('application/json')
        .send({openplatformId: 1234, foo: 'bar'})
        .expect(expectError_MalformedInput_AdditionalProperties);
    });

    const role = {
      openplatformId: seeder.knownUserId(),
      role: 'editor'
    };

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPost();
        return webapp
          .post(location)
          .type('application/json')
          .send(role)
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should complain when user does not exist', () => {
      return webapp
        .post(location)
        .type('application/json')
        .send({openplatformId: '1234', role: 'editor'})
        .expect(expectError_UserDoesNotExist);
    });

    it('should add a role that user does not have already', () => {
      return webapp
        .post(location)
        .type('application/json')
        .send(role)
        .expect(200);
    });

    it('should ignore role that user already has');
  });

  //
  // HELPERS
  //

  function expectError_UserDoesNotExist(response) {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/user not found/i);
      expect(error.detail).to.match(/no user with openplatform id/i);
    });
    expect(response.status).to.equal(404);
  }
});
