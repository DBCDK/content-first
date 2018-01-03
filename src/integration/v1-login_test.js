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
const remoteLoginStem = new RegExp('^' + config.login.url + '/login\\?token');

describe('User login', () => {
  const webapp = request(mock.external);

  const knownUserId = '0101781234';

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity(knownUserId);
  });

  afterEach(async function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  describe('GET /v1/login', () => {
    it('should retrieve existing user data on valid cookie', async () => {
      await sleep(100); // Apperently Elvis needs time get out of bed.
      // Act.
      return (
        webapp
          .get('/v1/login')
          .set('cookie', 'login-token=a-valid-login-token-seeded-on-test-start')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/user-links-out.json');
              expectValidate(data, 'schemas/user-data-out.json');
              expectValidate(data.shortlist, 'schemas/shortlist-data-out.json');
              expectValidate(data.lists, 'schemas/lists-data-out.json');
              expectValidate(data.profiles, 'schemas/profiles-data-out.json');
              expect(data.name).to.deep.equal('Jens Godfredsen');
              expect(data.shortlist).to.deep.equal([
                {
                  pid: '870970-basis-22629344',
                  origin: 'en-god-bog'
                }
              ]);
              expect(data.profiles).to.deep.equal([
                {
                  name: 'Med på den værste',
                  profile: {
                    moods: [
                      'Åbent fortolkningsrum',
                      'frygtelig',
                      'fantasifuld'
                    ],
                    genres: ['Brevromaner', 'Noveller'],
                    authors: [
                      'Hanne Vibeke Holst',
                      'Anne Lise Marstrand Jørgensen'
                    ],
                    archetypes: ['hestepigen']
                  }
                }
              ]);
              expect(data.lists).to.deep.include({
                id: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
                type: 'SYSTEM_LIST',
                public: false,
                title: 'My List',
                description: 'A brand new list',
                list: [
                  {
                    pid: '870970-basis-22629344',
                    description: 'Magic to the people'
                  }
                ]
              });
              expect(data.lists).to.deep.include({
                id: 'fa4f3a3de3a34a188234ed298ecbe810',
                type: 'CUSTOM_LIST',
                public: false,
                title: 'Gamle Perler',
                description: 'Bøger man simpelthen må læse',
                list: [
                  {
                    pid: '870970-basis-47573974',
                    description: 'Russisk forvekslingskomedie'
                  }
                ]
              });
            });
            expect(mock.getErrorLog().args).to.have.length(0);
          })
          .expect(200)
      );
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
          .set('cookie', 'login-token=expired-login-token-seeded-on-test-start')
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
      /* TODO: /^login-token=([^;]+); max-age=([0-9]+); path=\/; expires=([^;]+); httponly; secure/i;*/
      /^login-token=([^;]+); max-age=([0-9]+); path=\/; expires=([^;]+); httponly/i;

    it('should retrieve user info, create user & redirect with new cookie', () => {
      // Arrange.
      const token = 'f67837cd-f8f8-40fc-b80c-c2f2cff86944';
      const id = 1234;
      const hejmdal = arrangeLoginServiceToReturnUserWithUserIdOnTokenAndId(
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
                    name: '',
                    shortlist: [],
                    profiles: [],
                    lists: []
                  });
                });
                expect(hejmdal.isDone());
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
      const hejmdal = arrangeLoginServiceToReturnUserWithUserIdOnTokenAndId(
        knownUserId,
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
            // Act.
            return webapp
              .get('/v1/login')
              .set('cookie', `login-token=${loginToken}`)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/user-links-out.json');
                  expectValidate(data, 'schemas/user-data-out.json');
                  expectValidate(
                    data.shortlist,
                    'schemas/shortlist-data-out.json'
                  );
                  expectValidate(data.lists, 'schemas/lists-data-out.json');
                  expectValidate(
                    data.profiles,
                    'schemas/profiles-data-out.json'
                  );
                  expect(data.name).to.deep.equal('Jens Godfredsen');
                  expect(data.shortlist).to.deep.equal([
                    {
                      pid: '870970-basis-22629344',
                      origin: 'en-god-bog'
                    }
                  ]);
                  expect(data.profiles).to.deep.equal([
                    {
                      name: 'Med på den værste',
                      profile: {
                        moods: [
                          'Åbent fortolkningsrum',
                          'frygtelig',
                          'fantasifuld'
                        ],
                        genres: ['Brevromaner', 'Noveller'],
                        authors: [
                          'Hanne Vibeke Holst',
                          'Anne Lise Marstrand Jørgensen'
                        ],
                        archetypes: ['hestepigen']
                      }
                    }
                  ]);
                  expect(data.lists).to.deep.include({
                    id: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
                    type: 'SYSTEM_LIST',
                    public: false,
                    title: 'My List',
                    description: 'A brand new list',
                    list: [
                      {
                        pid: '870970-basis-22629344',
                        description: 'Magic to the people'
                      }
                    ]
                  });
                  expect(data.lists).to.deep.include({
                    id: 'fa4f3a3de3a34a188234ed298ecbe810',
                    type: 'CUSTOM_LIST',
                    public: false,
                    title: 'Gamle Perler',
                    description: 'Bøger man simpelthen må læse',
                    list: [
                      {
                        pid: '870970-basis-47573974',
                        description: 'Russisk forvekslingskomedie'
                      }
                    ]
                  });
                });
                expect(hejmdal.isDone());
                expect(mock.getErrorLog().args).to.have.length(0);
              })
              .expect(200);
          })
      );
    });

    it('should handle failure to retrieve info and redirect', () => {
      // Arrange.
      const token = 'b4c4ba3a-f251-4632-8535-a1c86730855c';
      const id = 5724;
      const hejmdal = arrangeLoginServiceToReplyWIthErrorOnTokenAndId(
        token,
        id
      );
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
      userId,
      token,
      id
    ) {
      const slug = `${loginConstants.apiGetTicket}/${token}/${id}`;
      return nock(config.login.url)
        .get(slug)
        .reply(200, {
          attributes: {
            cpr: userId,
            userId: userId,
            wayfId: null,
            uniloginId: null,
            agencies: [
              {
                userId: userId,
                agencyId: '715100',
                userIdType: 'CPR'
              }
            ]
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

    function arrangeLoginServiceToReplyWIthErrorOnTokenAndId(token, id) {
      const slug = `${loginConstants.apiGetTicket}/${token}/${id}`;
      return nock(config.login.url)
        .get(slug)
        .replyWithError('Something bad happened');
    }
  });
});
