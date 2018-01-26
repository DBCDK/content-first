/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const request = require('supertest');
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
  expectListsSeededOnTestStart,
  expectSuccess_UserData,
  expectSuccess_UserSeededOnTestStart,
  sleep
} = require('./test-commons');

describe('User data', () => {
  const webapp = request(mock.external);
  const location = '/v1/user';

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity('u9YaYSg6MlduZVnCkhv4N0wnt8g7Oa+f');
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('GET /v1/user', () => {
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

    it('should retrieve user data when logged in', async () => {
      await sleep(100); // Apparently Elvis needs time get out of bed.
      return webapp
        .get(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_UserSeededOnTestStart);
    });
  });

  describe('PUT /v1/user', () => {
    const newUserInfo = {
      name: 'Ole Henriksen',
      shortlist: [
        {
          pid: 'already-seeded-pid-blendstrup-havelaagebogen',
          origin: 'en-let-læst-bog'
        },
        {
          pid: 'already-seeded-pid-martin-ridder',
          origin: 'bibliotikarens-ugentlige-anbefaling'
        }
      ],
      profiles: [
        {
          name: 'En tynd en',
          profile: {
            moods: ['frygtelig'],
            authors: ['Carsten Jensen'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
          }
        }
      ]
    };

    it('should complain about user not logged in when no token', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_MissingLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .put(location)
        .set('cookie', 'login-token=token-not-known-to-service')
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .put(location)
        .set('cookie', 'login-token=expired-login-token')
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_ExpiredLoginToken(location));
    });

    it('should reject wrong content type', () => {
      return webapp
        .put(location)
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    it('should reject invalid content', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send({foo: 'bar'})
        .expect(expectError_MalformedInput_AdditionalProperties);
    });

    describe.skip('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPut();
        return webapp
          .put(location)
          .set('cookie', 'login-token=a-valid-login-token')
          .type('application/json')
          .send(newUserInfo)
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should update valid content for logged-in user', () => {
      // const expectedOutput = _.clone(newUserInfo);
      return webapp
        .put(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .type('application/json')
        .send(newUserInfo)
        .expect(expectSuccess_UserData(location, newUserInfo))
        .then(() => {
          return webapp
            .get(location)
            .set('cookie', 'login-token=a-valid-login-token')
            .expect(res => {
              expectSuccess_UserData(location, newUserInfo)(res);
              expectListsSeededOnTestStart(res.body.data.lists);
            });
        });
    });
  });
});
