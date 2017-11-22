/* eslint-env mocha */
'use strict';

// const MockServer = require('./mock-server');
const mock = require('./mock-server');
const {expect} = require('chai');
const request = require('supertest');
const nock = require('nock');
const config = require('server/config');
const constants = require('server/constants')();
const authenticator = require('server/authenticator');
const authConstants = require('__/service/authentication-constants')();
const loginConstants = require('__/service/login-constants')();
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');
const remoteLoginStem = new RegExp('^' + config.login.url + '/login\\?token');

describe('User login/out', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.beforeEach();
  });
  afterEach(() => {
    mock.afterEach();
  });

  describe('POST /v1/logout', () => {

    it('should invalidate current cookie and redirect to external logout page', () => {
      // Arrange.
      authenticator.clear();
      const token = '840e75ac9af8448898fe7f7c99198a7d';
      nock(config.auth.url).post(authConstants.apiGetToken).reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: authConstants.s_OneMonth
      });
      const remoteLogoutStem = new RegExp(
        '^' + config.login.url + '/logout\\?token=' + token + '&returnurl=' +
        constants.pages.loggedOut
      );
      // Act.
      return webapp.post('/v1/logout')
        .set('cookie', 'login-token=a-valid-login-token-seeded-on-test-start')
        // Assert.
        .expect(303)
        .expect('location', remoteLogoutStem)
        // Act.
        .then(() => {
          return webapp.get('/v1/user')
            .set('cookie', 'login-token=a-valid-login-token-seeded-on-test-start')
            // Assert.
            .expect(403)
            .expect(() => {
              expect(mock.getErrorLog().args).to.have.length(0);
            });
        });
    });

    it('should allow invalid cookie and redirect to external logout page', () => {
      // Arrange.
      authenticator.clear();
      const token = '840e75ac9af8448898fe7f7c99198a7d';
      nock(config.auth.url).post(authConstants.apiGetToken).reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: authConstants.s_OneMonth
      });
      const remoteLogoutStem = new RegExp(
        '^' + config.login.url + '/logout\\?token=' + token + '&returnurl=' +
        constants.pages.loggedOut
      );
      // Act.
      return webapp.post('/v1/logout')
        .set('cookie', 'login-token=a-cookie-that-never-existed')
        // Assert.
        .expect(303)
        .expect('location', remoteLogoutStem)
        .expect(() => {
          expect(mock.getErrorLog().args).to.have.length(0);
        });
    });

    it('should allow no current cookie and redirect to logged-out page', () => {
      // Arrange.
      authenticator.clear();
      const token = '840e75ac9af8448898fe7f7c99198a7d';
      nock(config.auth.url).post(authConstants.apiGetToken).reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: authConstants.s_OneMonth
      });
      // Act.
      return webapp.post('/v1/logout')
        // Assert.
        .expect(303)
        .expect('location', constants.pages.loggedOut)
        .expect(() => {
          expect(mock.getErrorLog().args).to.have.length(0);
        });
    });

    it('should report error when external authenticator is unreachable', () => {
      // Arrange.
      authenticator.clear();
      // Act.
      return webapp.post('/v1/logout')
        // Assert.
        .expect(503)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/authentication.service communication failed/i);
          });
          expect(mock.getErrorLog().args).to.match(/getting authentication token failed/i);
        });
    });
  });
});
