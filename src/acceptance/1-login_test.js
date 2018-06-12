/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
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
const remoteLoginStem = new RegExp('^' + config.login.url + '/login\\?token');

describe('User login', () => {
  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
  });

  afterEach(async function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('GET /v1/login', () => {
    it('should retrieve existing user data on valid cookie', async () => {
      const result = await webapp
        .get('/v1/login')
        .set(
          'cookie',
          'login-token=valid-login-token-for-user-seeded-on-test-start'
        );

      expect(result.status).to.equal(200);
      expect(result.body).to.deep.equal({
        data: {
          id: 123456,
          created_epoch: 1517919638,
          name: 'testuser 123456',
          openplatformId: '123openplatformId456',
          openplatformToken: '123openplatformToken456',
          image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
          roles: [],
          acceptedTerms: true,
          profiles: [],
          lists: [
            {
              data: {
                created_epoch: 1522753045,
                modified_epoch: 1522753045,
                owner: '123openplatformId456',
                public: false,
                social: false,
                open: false,
                type: 'SYSTEM_LIST',
                title: 'Har læst',
                description: 'En liste over læste bøger',
                list: []
              },
              links: {self: '/v1/lists/830e113a-e2f3-44a6-8d4c-3918668b5769'}
            },
            {
              data: {
                created_epoch: 1522753045,
                modified_epoch: 1522753045,
                owner: '123openplatformId456',
                public: false,
                social: false,
                open: false,
                type: 'SYSTEM_LIST',
                title: 'Vil læse',
                description: 'En liste over bøger jeg gerne vil læse',
                list: []
              },
              links: {self: '/v1/lists/7c4a330b-750f-460a-8b17-00bab11a2c6f'}
            }
          ],
          shortlist: [
            {pid: '870970-basis:52041082', origin: 'Fra "En god bog"'},
            {pid: '870970-basis:26296218', origin: 'Fra "En god bog"'},
            {pid: '870970-basis:52817757', origin: 'Fra "En god bog"'}
          ]
        },
        links: {self: '/v1/user'}
      });
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
      /^login-token=([^;]+); path=\/; httponly/i;

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
        '123openplatformId456',
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
                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal({
                  data: {
                    openplatformToken: 'someToken',
                    id: 123456,
                    created_epoch: 1517919638,
                    name: 'testuser 123456',
                    openplatformId: '123openplatformId456',
                    image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
                    roles: [],
                    acceptedTerms: true,
                    profiles: [],
                    lists: [
                      {
                        data: {
                          created_epoch: 1522753045,
                          modified_epoch: 1522753045,
                          owner: '123openplatformId456',
                          public: false,
                          social: false,
                          open: false,
                          type: 'SYSTEM_LIST',
                          title: 'Har læst',
                          description: 'En liste over læste bøger',
                          list: []
                        },
                        links: {
                          self: '/v1/lists/830e113a-e2f3-44a6-8d4c-3918668b5769'
                        }
                      },
                      {
                        data: {
                          created_epoch: 1522753045,
                          modified_epoch: 1522753045,
                          owner: '123openplatformId456',
                          public: false,
                          social: false,
                          open: false,
                          type: 'SYSTEM_LIST',
                          title: 'Vil læse',
                          description: 'En liste over bøger jeg gerne vil læse',
                          list: []
                        },
                        links: {
                          self: '/v1/lists/7c4a330b-750f-460a-8b17-00bab11a2c6f'
                        }
                      }
                    ],
                    shortlist: [
                      {
                        pid: '870970-basis:52041082',
                        origin: 'Fra "En god bog"'
                      },
                      {
                        pid: '870970-basis:26296218',
                        origin: 'Fra "En god bog"'
                      },
                      {pid: '870970-basis:52817757', origin: 'Fra "En god bog"'}
                    ]
                  },
                  links: {self: '/v1/user'}
                });
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

    function arrangeLoginServiceToReplyWithError(token, id) {
      const slug = `${loginConstants.apiGetTicket}/${token}/${id}`;
      return nock(config.login.url)
        .get(slug)
        .replyWithError('Something bad happened');
    }
  });
});
