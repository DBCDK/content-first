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
  expectError_MissingLoginToken,
  expectError_WrongContentType,
  expectSuccess_ShortlistSeededOnTestStart,
  expectError_MalformedInput_RequiredProperties,
  expectError_ExpiredLoginToken,
  expectError_UnknownLoginToken,
  expectError_CommunityConnectionProblem
} = require('./test-commons');

describe('Shortlist', () => {
  const location = '/v1/shortlist';
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

  describe('GET /v1/shortlist', () => {
    it('should complain about user not logged in when no token', () => {
      return webapp // force break
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

    it('should retrieve shortlist', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_ShortlistSeededOnTestStart);
    });
  });

  describe('PUT /v1/shortlist', () => {
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
        .set('cookie', 'login-token=a-valid-login-token')
        .type('application/json')
        .send([{foo: 'bar'}])
        .expect(expectError_MalformedInput_RequiredProperties);
    });

    const newShortlist = [
      {
        pid: '870970-basis-53188931',
        origin: 'en-let-læst-bog'
      },
      {
        pid: '870970-basis-51752341',
        origin: 'bibliotikarens-ugentlige-anbefaling'
      }
    ];

    it('should complain about user not logged in when no token', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newShortlist)
        .expect(expectError_MissingLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newShortlist)
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
          .send(newShortlist)
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should overwrite shortlist', () => {
      // Arrange.
      const loginToken = 'a-valid-login-token';
      // Act.
      return (
        webapp
          .put(location)
          .set('cookie', `login-token=${loginToken}`)
          .type('application/json')
          .send(newShortlist)
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links).to.have.property('self');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/shortlist-data-out.json');
              expect(data).to.deep.equal(newShortlist);
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
                    expectValidate(links, 'schemas/shortlist-links-out.json');
                    expect(links.self).to.equal(location);
                    expectValidate(data, 'schemas/shortlist-data-out.json');
                    expect(data).to.deep.equal(newShortlist);
                  });
                })
                .expect(200)
            );
          })
      );
    });
  });
});
