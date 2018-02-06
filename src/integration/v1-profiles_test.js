/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectValidate} = require('fixtures/output-verifiers');
const nock = require('nock');
const {
  arrangeCommunityServiceToRespondWithServerError_OnGet,
  arrangeCommunityServiceToRespondWithServerError_OnPut,
  expectError_CommunityConnectionProblem,
  expectError_ExpiredLoginToken,
  expectError_MalformedInput_AdditionalProperties,
  expectError_MissingLoginToken,
  expectError_UnknownLoginToken,
  expectError_WrongContentType,
  expectSuccess_ProfilesSeededOnTestStart
} = require('./test-commons');

describe('Profiles', () => {
  const location = '/v1/profiles';
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

  describe('GET /v1/profiles', () => {
    it('should complain about user not logged in when no token', () => {
      return webapp
        .get(location)
        .expect(expectError_MissingLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=token-not-known-to-service')
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=expired-login-token')
        .expect(expectError_ExpiredLoginToken(location));
    });

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnGet();
        return webapp
          .get(location)
          .set('cookie', 'login-token=a-valid-login-token')
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should retrieve profiles', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_ProfilesSeededOnTestStart);
    });
  });

  describe('PUT /v1/profiles', () => {
    const newProfiles = [
      {
        name: 'En tynd en',
        profile: {
          moods: ['frygtelig'],
          authors: ['Carsten Jensen'],
          genres: ['Skæbnefortællinger'],
          archetypes: ['Goth']
        }
      },
      {
        name: 'Ny profile',
        profile: {
          moods: ['dramatisk'],
          authors: ['Helge Sander'],
          genres: ['Skæbnefortællinger'],
          archetypes: ['Goth']
        }
      }
    ];

    it('should reject wrong content type', () => {
      return webapp
        .put(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    it('should reject invalid content', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send([{foo: 'bar'}])
        .expect(expectError_MalformedInput_AdditionalProperties);
    });

    it('should complain about user not logged in when no token', () => {
      return webapp // force break
        .put(location)
        .type('application/json')
        .send(newProfiles)
        .expect(expectError_MissingLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newProfiles)
        .set('cookie', 'login-token=token-not-known-to-service')
        .expect(expectError_UnknownLoginToken(location));
    });

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPut();
        return webapp
          .put(location)
          .set('cookie', 'login-token=a-valid-login-token')
          .type('application/json')
          .send(newProfiles)
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should overwrite profiles', () => {
      // Arrange.
      const loginToken = 'a-valid-login-token';
      // Act.
      return (
        webapp
          .put(location)
          .set('cookie', `login-token=${loginToken}`)
          .type('application/json')
          .send(newProfiles)
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links).to.have.property('self');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/profiles-data-out.json');
              expect(data).to.deep.equal(newProfiles);
            });
          })
          .expect(200)
          .then(() => {
            // Act.
            return (
              webapp
                .get(location)
                .set('cookie', `login-token=${loginToken}`)
                // Assert.
                .expect(res => {
                  expectSuccess(res.body, (links, data) => {
                    expectValidate(links, 'schemas/profiles-links-out.json');
                    expect(links.self).to.equal(location);
                    expectValidate(data, 'schemas/profiles-data-out.json');
                    expect(data).to.deep.equal(newProfiles);
                  });
                })
                .expect(200)
            );
          })
      );
    });
  });
});
