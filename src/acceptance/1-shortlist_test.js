/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const request = require('supertest');
const {expect} = require('chai');
const {
  expectError_WrongContentType,
  expectError_UnknownLoginToken
} = require('./user-test-commons');

describe('Shortlist', () => {
  const location = '/v1/shortlist';
  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
  });

  afterEach(function() {
    /*
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
    */
  });

  describe('GET /v1/shortlist', () => {
    it('should complain about user not logged in when no token', () => {
      return webapp // force break
        .get(location)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .get(location)
        .set('cookie', mock.createLoginCookie('token-not-known-to-service'))
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .get(location)
        .set('cookie', mock.createLoginCookie('expired-login-token'))
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should retrieve shortlist', async () => {
      const result = await webapp
        .get(location)
        .set(
          'cookie',
          mock.createLoginCookie(
            'valid-login-token-for-user-seeded-on-test-start'
          )
        );
      expect(result.status).to.equal(200);
      expect(result.body.data).to.deep.equal([
        {pid: '870970-basis:52041082', origin: 'Fra "En god bog"'},
        {pid: '870970-basis:26296218', origin: 'Fra "En god bog"'},
        {pid: '870970-basis:52817757', origin: 'Fra "En god bog"'}
      ]);
    });
  });

  describe('PUT /v1/shortlist', () => {
    it('should reject wrong content type', () => {
      return webapp
        .put(location)
        .set(
          'cookie',
          mock.createLoginCookie(
            'valid-login-token-for-user-seeded-on-test-start'
          )
        )
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    const newShortlist = [
      {
        pid: '870970-basis-53188931',
        origin: 'en-let-læst-bog'
      },
      {
        pid: '870970-basis-51752341',
        origin: 'bibliotekarens-ugentlige-anbefaling'
      }
    ];

    it('should complain about user not logged in when no token', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newShortlist)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newShortlist)
        .set('cookie', mock.createLoginCookie('token-not-known-to-service'))
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should overwrite shortlist', async () => {
      const loginCookie = mock.createLoginCookie(
        'valid-login-token-for-user-seeded-on-test-start'
      );

      let result = await webapp
        .put(location)
        .set('cookie', loginCookie)
        .type('application/json')
        .send(newShortlist);
      expect(result.status).to.equal(200);
      expect(result.body).to.deep.equal({
        data: newShortlist,
        links: {self: location}
      });

      result = await webapp
        .put(location)
        .set('cookie', loginCookie)
        .type('application/json')
        .send(newShortlist);
      expect(result.status).to.equal(200);
      expect(result.body).to.deep.equal({
        data: newShortlist,
        links: {self: location}
      });
    });
  });
});
