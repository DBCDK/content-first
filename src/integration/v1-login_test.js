/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const {expect} = require('chai');
const request = require('supertest');
const nock = require('nock');
const config = require('server/config');
const constants = require('server/constants')();
const authenticator = require('server/authenticator');
const authConstants = require('__/services/smaug/authentication-constants')();
const loginConstants = require('__/services/hejmdal/login-constants')();
const {
  expectSuccess,
  expectFailure,
  expectValidate
} = require('fixtures/output-verifiers');
const {expectSuccess_UserSeededOnTestStart, sleep} = require('./test-commons');
const remoteLoginStem = new RegExp('^' + config.login.url + '/login\\?token');

describe('User login', () => {
  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity();
  });

  afterEach(async function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('GET /v1/login', () => {
    it('should retrieve existing user data on valid cookie', async () => {
      await sleep(100); // Apparently Elvis needs time get out of bed.
      return webapp
        .get('/v1/login')
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_UserSeededOnTestStart);
    });

    it('should redirect to remote login page on no cookie', () => {
      // Arrange.
      authenticator.clear();
      const token = '840e75ac9af8448898fe7f7c99198a7d';
      nock(config.auth.url)
        .post(authConstants.apiGetToken)
        .reply(200, {
          token_type: 'bearer',
          access_token: token,
          expires_in: authConstants.s_OneMonth
        });
      // Act.
      return (
        webapp
          .get('/v1/login')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/login-links-out.json');
              const remote = `${config.login.url}/login?token=${token}`;
              expect(links.login).to.equal(remote);
              expectValidate(data, 'schemas/login-data-out.json');
              expect(data).to.equal(remote);
            });
            expect(mock.getErrorLog().args).to.have.length(0);
          })
          .expect('location', remoteLoginStem)
          .expect(303)
      );
    });

    it('should redirect to remote login page on non-existing cookie', () => {
      // Arrange.
      authenticator.clear();
      const token = '840e75ac9af8448898fe7f7c99198a7d';
      nock(config.auth.url)
        .post(authConstants.apiGetToken)
        .reply(200, {
          token_type: 'bearer',
          access_token: token,
          expires_in: authConstants.s_OneMonth
        });
      // Act.
      return (
        webapp
          .get('/v1/login')
          .set('cookie', 'login-token=AC9C12A9-68CA-4534-930E-37FF635C8408')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/login-links-out.json');
              const remote = `${config.login.url}/login?token=${token}`;
              expect(links.login).to.equal(remote);
              expectValidate(data, 'schemas/login-data-out.json');
              expect(data).to.equal(remote);
            });
            expect(mock.getErrorLog().args).to.have.length(0);
          })
          .expect('location', remoteLoginStem)
          .expect(303)
      );
    });

    it('should redirect to remote login page on expired cookie', () => {
      // Arrange.
      authenticator.clear();
      const token = 'a7d847c9481840e75ac9af98fe7f9198';
      nock(config.auth.url)
        .post(authConstants.apiGetToken)
        .reply(200, {
          token_type: 'bearer',
          access_token: token,
          expires_in: authConstants.s_OneMonth
        });
      // Act.
      return (
        webapp
          .get('/v1/login')
          .set('cookie', 'login-token=expired-login-token')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/login-links-out.json');
              const remote = `${config.login.url}/login?token=${token}`;
              expect(links.login).to.equal(remote);
              expectValidate(data, 'schemas/login-data-out.json');
              expect(data).to.equal(remote);
            });
            expect(mock.getErrorLog().args).to.have.length(0);
          })
          .expect('location', remoteLoginStem)
          .expect(303)
      );
    });

    it('should handle failure to retrieve token', () => {
      // Arrange.
      authenticator.clear();
      nock(config.auth.url)
        .post(authConstants.apiGetToken)
        .reply(500);
      // Act.
      return (
        webapp
          .get('/v1/login')
          // Assert.
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(
                /authentication.service communication failed/i
              );
            });
            expect(mock.getErrorLog().args).to.match(
              /getting authentication token failed/i
            );
          })
          .expect(503)
      );
    });
  });

  describe('GET /hejmdal:token&id', () => {
    const cookieFormat =
      /* TODO: include "secure" in production? */
      /^login-token=([^;]+); max-age=([0-9]+); path=\/; expires=([^;]+); httponly/i;

    it('should retrieve user info, create user & redirect with new cookie', () => {
      // Arrange.
      const token = 'f67837cd-f8f8-40fc-b80c-c2f2cff86944';
      const id = 1234;
      arrangeLoginServiceToReturnUserWithUserIdOnTokenAndId(
        '1234567890',
        token,
        id
      );
      let loginToken;
      // Act.
      return (
        webapp
          .get(`/hejmdal?token=${token}&id=${id}`)
          // Assert.
          .expect(res => {
            const cookies = res.headers['set-cookie'];
            const cookieParts = extractLoginCookie(cookies);
            loginToken = cookieParts[1];
            expectExpireInOneMonth(cookieParts[2]);
            expect(mock.getErrorLog().args).to.have.length(0);
          })
          .expect(303)
          .expect('location', constants.pages.start)
          .expect('set-cookie', /^login-token=/)
          .then(() => {
            // Act.
            return webapp
              .get('/v1/login')
              .set('cookie', `login-token=${loginToken}`)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/user-links-out.json');
                  expectValidate(data, 'schemas/user-data-out.json');
                  expect(data).to.deep.equal({
                    openplatformId: '1234567890',
                    openplatformToken: 'someToken',
                    name: '',
                    roles: [],
                    shortlist: [],
                    profiles: [],
                    lists: []
                  });
                });
                expect(nock.isDone());
                expect(mock.getErrorLog().args).to.have.length(0);
              })
              .expect(200);
          })
      );
    });

    it('should retrieve user info, detect existing user, and redirect', () => {
      // Arrange.
      const token = '3b709b2a-37bb-4556-8021-e86b56e8f571';
      const id = 4321;
      arrangeLoginServiceToReturnUserWithUserIdOnTokenAndId(
        seeder.knownUserId(),
        token,
        id
      );
      let loginToken;
      // Act.
      const location = `/hejmdal?token=${token}&id=${id}`;
      return (
        webapp
          .get(location)
          // Assert.
          .expect(303)
          .expect('location', constants.pages.start)
          .expect('set-cookie', /^login-token=/)
          .then(res => {
            const cookies = res.headers['set-cookie'];
            const cookieParts = extractLoginCookie(cookies);
            loginToken = cookieParts[1];
          })
          .then(() => {
            return webapp
              .get('/v1/login')
              .set('cookie', `login-token=${loginToken}`)
              .expect(res => {
                expectSuccess_UserSeededOnTestStart(res);
                expect(nock.isDone());
                expect(mock.getErrorLog().args).to.have.length(0);
              });
          })
      );
    });

    it('should handle failure to retrieve info and redirect', () => {
      // Arrange.
      const token = 'b4c4ba3a-f251-4632-8535-a1c86730855c';
      const id = 5724;
      const hejmdal = arrangeLoginServiceToReplyWithError(token, id);
      // Act.
      return (
        webapp
          .get(`/hejmdal?token=${token}&id=${id}`)
          // Assert.
          .expect(() => {
            expect(hejmdal.isDone());
            expect(mock.getErrorLog().args).to.have.length(1);
          })
          .expect('location', constants.pages.generalError)
          .expect(303)
      );
    });

    //
    // Helpers.
    //

    function arrangeLoginServiceToReturnUserWithUserIdOnTokenAndId(
      openplatformId,
      token,
      id
    ) {
      const slug = `${loginConstants.apiGetTicket}/${token}/${id}`;
      nock(config.login.url)
        .get(slug)
        .reply(200, {
          attributes: {
            authenticatedToken: 'someToken',
            cpr: 'someUserId',
            userId: 'someUserId',
            wayfId: null,
            agencies: [
              {
                userId: 'someUserId',
                agencyId: '715100',
                userIdType: 'CPR'
              }
            ]
          }
        });
      nock(config.login.openplatformUrl)
        .get(loginConstants.apiGetUserIdByToken('someToken'))
        .reply(200, {
          statusCode: 200,
          data: {
            id: openplatformId,
            name: 'BIBLO testlåner',
            address: 'Roskilde Bibliotek',
            postalCode: '0000',
            loans: [],
            orders: [],
            debt: [],
            ddbcmsapi: 'https://cmscontent.dbc.dk/'
          }
        });
    }

    function extractLoginCookie(cookies) {
      expect(cookies).to.have.length(1);
      expect(cookies[0]).to.match(cookieFormat);
      return cookies[0].match(cookieFormat);
    }

    function expectExpireInOneMonth(epochString) {
      const s_ExpiresIn = parseInt(epochString, 10);
      const s_OneMonth = 30 * 24 * 60 * 60;
      expect(s_ExpiresIn).to.equal(s_OneMonth);
    }

    function arrangeLoginServiceToReplyWithError(token, id) {
      const slug = `${loginConstants.apiGetTicket}/${token}/${id}`;
      return nock(config.login.url)
        .get(slug)
        .replyWithError('Something bad happened');
    }
  });
});
