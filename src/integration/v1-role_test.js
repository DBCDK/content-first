/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const request = require('supertest');
const nock = require('nock');
const {
  arrangeCommunityServiceToRespondWithServerError_OnPost,
  expectError_CommunityConnectionProblem,
  expectError_MalformedInput_AdditionalProperties,
  expectError_UserDoesNotExist,
  expectError_WrongContentType,
  expectSuccess_UserHasRoles
} = require('./test-commons');

describe('Roles', () => {
  const internal = request(mock.internal);
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

  //
  // POST /v1/role-add
  //
  describe('POST /v1/role-add', () => {
    const location = '/v1/role-add';

    it('should reject wrong content type', () => {
      return internal
        .post(location)
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    it('should reject invalid content', () => {
      return internal
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
        return internal
          .post(location)
          .type('application/json')
          .send(role)
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should complain when user does not exist', () => {
      return internal
        .post(location)
        .type('application/json')
        .send({openplatformId: '1234', role: 'editor'})
        .expect(expectError_UserDoesNotExist);
    });

    it('should add a role that user does not have already', () => {
      // Act.
      return internal
        .post(location)
        .type('application/json')
        .send(role)
        .expect(200)
        .then(() => {
          // Assert.
          const uri = `/v1/user/${encodeURIComponent(seeder.knownUserId())}`;
          return webapp
            .get(uri) // force break
            .expect(expectSuccess_UserHasRoles(['editor']));
        });
    });

    it('should ignore role that user already has', () => {
      // Arrange.
      return internal
        .post(location)
        .type('application/json')
        .send(role)
        .expect(200)
        .then(() => {
          // Act.
          return internal
            .post(location)
            .type('application/json')
            .send(role)
            .expect(200);
        })
        .then(() => {
          // Assert.
          const uri = `/v1/user/${encodeURIComponent(seeder.knownUserId())}`;
          return webapp
            .get(uri) // force break
            .expect(expectSuccess_UserHasRoles(['editor']));
        });
    });
  });

  //
  // POST /v1/role-remove
  //
  describe('POST /v1/role-remove', () => {
    const location = '/v1/role-remove';

    it('should reject wrong content type', () => {
      return internal
        .post(location)
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    it('should reject invalid content', () => {
      return internal
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
        return internal
          .post(location)
          .type('application/json')
          .send(role)
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should complain when user does not exist', () => {
      return internal
        .post(location)
        .type('application/json')
        .send({openplatformId: '1234', role: 'editor'})
        .expect(expectError_UserDoesNotExist);
    });

    it('should ignore role that user does not have', () => {
      return internal
        .post(location)
        .type('application/json')
        .send(role)
        .expect(200)
        .then(() => {
          const uri = `/v1/user/${encodeURIComponent(seeder.knownUserId())}`;
          return webapp
            .get(uri) // force break
            .expect(expectSuccess_UserHasRoles([]));
        });
    });

    it('should remove a role that user already has', () => {
      // Arrange.
      return internal
        .post('/v1/role-add')
        .type('application/json')
        .send(role)
        .expect(200)
        .then(() => {
          // Act.
          return internal
            .post(location)
            .type('application/json')
            .send(role)
            .expect(200);
        })
        .then(() => {
          // Assert.
          const uri = `/v1/user/${encodeURIComponent(seeder.knownUserId())}`;
          return webapp
            .get(uri) // force break
            .expect(expectSuccess_UserHasRoles([]));
        });
    });
  });
});
