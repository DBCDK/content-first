/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {
  expectError_UnknownLoginToken,
  expectError_UserDoesNotExist,
  expectError_WrongContentType
} = require('./user-test-commons');

describe('User data', () => {
  const webapp = request(mock.external);
  const internalApp = request(mock.internal);
  const location = '/v1/user';

  beforeEach(async () => {
    await mock.resetting();
    await internalApp.get('/v1/test/initStorage');
    await webapp
      .post('/v1/object')
      .set(
        'cookie',
        mock.createLoginCookie(
          'valid-login-token-for-user-seeded-on-test-start'
        )
      )
      .send({
        _type: 'USER_PROFILE',
        name: 'Test Name',
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
        _public: true
      });
  });

  afterEach(async () => {
    await internalApp.get('/v1/test/wipeStorage');
  });

  describe('GET /v1/user/:id', () => {
    const existingUserUri = `/v1/user/${encodeURIComponent(
      '123openplatformId456'
    )}`;

    it('should handle non-existing user', () => {
      return webapp
        .get('/v1/user/does-not-exist')
        .expect(expectError_UserDoesNotExist);
    });

    it('should retrieve user data', async () => {
      const userData = (await webapp.get(existingUserUri)).body.data;
      expect(userData).to.deep.equal({
        name: 'Test Name',
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
        openplatformId: '123openplatformId456'
      });
    });
  });

  describe('GET /v1/user', () => {
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

    it('should retrieve user data when logged in', async () => {
      const result = await webapp
        .get(location)
        .set(
          'cookie',
          mock.createLoginCookie(
            'valid-login-token-for-user-seeded-on-test-start'
          )
        );
      expect(result.body.data).to.deep.equal({
        name: 'Test Name',
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
        openplatformId: '123openplatformId456',
        openplatformToken: '123openplatformToken456'
      });
    });
  });

  describe('PUT /v1/user', () => {
    const newUserInfo = {
      name: 'Ole Henriksen'
    };

    it('should complain about user not logged in when no token', () => {
      return webapp
        .put(location)
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .put(location)
        .set('cookie', mock.createLoginCookie('token-not-known-to-service'))
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .put(location)
        .set('cookie', mock.createLoginCookie('expired-login-token'))
        .type('application/json')
        .send(newUserInfo)
        .expect(expectError_UnknownLoginToken(location));
    });

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

    it('should update valid content for logged-in user', async () => {
      const expected = {
        name: 'Ole Henriksen',
        openplatformId: '123openplatformId456',
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a'
      };
      const updateResult = await webapp
        .put(location)
        .set(
          'cookie',
          mock.createLoginCookie(
            'valid-login-token-for-user-seeded-on-test-start'
          )
        )
        .type('application/json')
        .send(newUserInfo);
      expect(updateResult.body.data).to.deep.equal(expected);

      const getResult = await webapp
        .get(location)
        .set(
          'cookie',
          mock.createLoginCookie(
            'valid-login-token-for-user-seeded-on-test-start'
          )
        );
      expect(getResult.body.data).to.deep.equal({
        openplatformToken: '123openplatformToken456',
        ...expected
      });
    });
  });
  describe('DELETE /v1/user', () => {
    const existingUserUri = `/v1/user/${encodeURIComponent(
      '123openplatformId456'
    )}`;
    it('should fail with wrong user', async () => {
      const result = await webapp
        .delete(existingUserUri)
        .set(
          'cookie',
          mock.createLoginCookie(
            'valid-login-token-for-user2-seeded-on-test-start'
          )
        );
      expect(result.status).to.equal(403);
      expect(result.body).to.deep.equal({
        errors: [
          {
            status: 403,
            code: '403',
            title: 'Forbidden',
            detail: 'Not allowed to try to delete that user'
          }
        ]
      });

      const userData = await webapp.get(existingUserUri);
      expect(userData.status).to.equal(200);
    });
    it('should delete user', async () => {
      // TODO fix when storage supports it
      const result = await webapp
        .delete(existingUserUri)
        .set(
          'cookie',
          mock.createLoginCookie(
            'valid-login-token-for-user-seeded-on-test-start'
          )
        );
      expect(result.status).to.equal(200);
      expect(result.body).to.deep.equal({
        data: {success: true},
        links: {self: existingUserUri}
      });

      const userData = await webapp.get(existingUserUri);
      expect(userData.status).to.equal(404);
    });
  });
});
