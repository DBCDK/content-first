/* eslint-env mocha */
'use strict';

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

describe('User login', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.beforeEach();
  });
  afterEach(() => {
    mock.afterEach();
  });

  describe('GET /v1/login', () => {

    it('should retrieve existing user data on valid cookie', () => {
      // Act.
      return webapp.get('/v1/login')
        .set('cookie', 'login-token=a-valid-login-token-seeded-on-test-start')
        // Assert.
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/user-links-out.json');
            expectValidate(data, 'schemas/user-data-out.json');
            expect(data).to.deep.equal({
              name: 'Jens Godfredsen',
              shortlist: [{
                pid: '870970-basis-22629344',
                origin: 'en-god-bog'
              }],
              profiles: [{
                name: 'Med på den værste',
                profile: {
                  moods: ['Åbent fortolkningsrum', 'frygtelig', 'fantasifuld'],
                  genres: ['Brevromaner', 'Noveller'],
                  authors: ['Hanne Vibeke Holst', 'Anne Lise Marstrand Jørgensen'],
                  archetypes: ['hestepigen']
                }
              }]
            });
          });
          expect(mock.getErrorLog().args).to.have.length(0);
        })
        .expect(200);
    });

    it('should redirect to remote login page on no cookie', () => {
      // Arrange.
      authenticator.clear();
      const token = '840e75ac9af8448898fe7f7c99198a7d';
      nock(config.auth.url).post(authConstants.apiGetToken).reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: authConstants.s_OneMonth
      });
      // Act.
      return webapp.get('/v1/login')
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
        .expect(303);
    });

    it('should redirect to remote login page on non-existing cookie', () => {
      // Arrange.
      authenticator.clear();
      const token = '840e75ac9af8448898fe7f7c99198a7d';
      nock(config.auth.url).post(authConstants.apiGetToken).reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: authConstants.s_OneMonth
      });
      // Act.
      return webapp.get('/v1/login')
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
        .expect(303);
    });

    it('should redirect to remote login page on expired cookie', () => {
      // Arrange.
      authenticator.clear();
      const token = 'a7d847c9481840e75ac9af98fe7f9198';
      nock(config.auth.url).post(authConstants.apiGetToken).reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: authConstants.s_OneMonth
      });
      // Act.
      return webapp.get('/v1/login')
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
        .expect(303);
    });

    it('should handle failure to retrieve token', () => {
      // Arrange.
      authenticator.clear();
      nock(config.auth.url).post(authConstants.apiGetToken).reply(500);
      // Act.
      return webapp.get('/v1/login')
        // Assert.
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/authentication.service communication failed/i);
          });
          expect(mock.getErrorLog().args).to.match(/getting authentication token failed/i);
        })
        .expect(503);
    });
  });

  describe('GET /hejmdal:token&id', () => {

    const token = 'a-valid-login-token-seeded-on-test-start';
    const id = 4321;
    const slug = `${loginConstants.apiGetTicket}/${token}/${id}`;
    const cookieFormat =
      /* TODO: /^login-token=([^;]+); max-age=([0-9]+); path=\/; expires=([^;]+); httponly; secure/i;*/
      /^login-token=([^;]+); max-age=([0-9]+); path=\/; expires=([^;]+); httponly/i;

    it('should retrieve user info & redirect with valid cookie', () => {
      // Arrange.
      const hejmdal = nock(config.login.url).get(slug).reply(200, {
        attributes: {
          cpr: '1701840000',
          userId: '1701840000',
          wayfId: null,
          agencies: [{
            userId: '1701840000',
            agencyId: '715100',
            userIdType: 'CPR'
          }]
        }
      });
      let loginToken;
      // Act.
      const location = `/hejmdal?token=${token}&id=${id}`;
      return webapp.get(location)
        // Assert.
        .expect(res => {
          const cookies = res.headers['set-cookie'];
          expect(cookies).to.have.length(1);
          expect(cookies[0]).to.match(cookieFormat);
          const cookieParts = cookies[0].match(cookieFormat);
          const s_ExpiresIn = parseInt(cookieParts[2], 10);
          const s_OneMonth = 30 * 24 * 60 * 60;
          expect(s_ExpiresIn).to.equal(s_OneMonth);
          loginToken = cookieParts[1];
          expect(mock.getErrorLog().args).to.have.length(0);
        })
        .expect(303)
        .expect('location', constants.pages.start)
        .expect('set-cookie', /^login-token=/)
        .then(() => {
          // Act.
          return webapp.get('/v1/login')
            .set('cookie', `login-token=${loginToken}`)
            .expect(res => {
              expectSuccess(res.body, (links, data) => {
                expectValidate(links, 'schemas/user-links-out.json');
                expectValidate(data, 'schemas/user-data-out.json');
                expect(data).to.deep.equal({
                  name: '',
                  shortlist: [],
                  profiles: []
                });
              });
              expect(hejmdal.isDone());
              expect(mock.getErrorLog().args).to.have.length(0);
            })
            .expect(200);
        });
    });

    it('should retrieve user info, detect existing user, and redirect', () => {
      // Arrange.
      const hejmdal = nock(config.login.url).get(slug).reply(200, {
        id,
        token,
        attributes: {
          cpr: '1212719873',
          gender: 'm',
          userId: '0101781234',
          wayfId: 'some-wayf-id',
          agencies: [],
          birthDate: '1212',
          birthYear: '1971',
          uniloginId: 'some-unilogin-id',
          municipality: null
        }
      });
      let loginToken;
      // Act.
      const location = `/hejmdal?token=${token}&id=${id}`;
      return webapp.get(location)
        // Assert.
        .expect(303)
        .expect('location', constants.pages.start)
        .expect('set-cookie', /^login-token=/)
        .then(res => {
          const cookies = res.headers['set-cookie'];
          expect(cookies).to.have.length(1);
          expect(cookies[0]).to.match(cookieFormat);
          const cookieParts = cookies[0].match(cookieFormat);
          loginToken = cookieParts[1];
        })
        .then(() => {
          // Act.
          return webapp.get('/v1/login')
            .set('cookie', `login-token=${loginToken}`)
            .expect(res => {
              expectSuccess(res.body, (links, data) => {
                expectValidate(links, 'schemas/user-links-out.json');
                expectValidate(data, 'schemas/user-data-out.json');
                expect(data).to.deep.equal({
                  name: 'Jens Godfredsen',
                  shortlist: [{
                    pid: '870970-basis-22629344',
                    origin: 'en-god-bog'
                  }],
                  profiles: [{
                    name: 'Med på den værste',
                    profile: {
                      moods: ['Åbent fortolkningsrum', 'frygtelig', 'fantasifuld'],
                      genres: ['Brevromaner', 'Noveller'],
                      authors: ['Hanne Vibeke Holst', 'Anne Lise Marstrand Jørgensen'],
                      archetypes: ['hestepigen']
                    }
                  }]
                });
              });
              expect(hejmdal.isDone());
              expect(mock.getErrorLog().args).to.have.length(0);
            })
            .expect(200);
        });
    });

    it('should handle failure to retrieve info and redirect', () => {
      // Arrange.
      const hejmdal = nock(config.login.url).get(slug).replyWithError(
        'Something bad happened'
      );
      // Act.
      const location = `/hejmdal?token=${token}&id=${id}`;
      return webapp.get(location)
        // Assert.
        .expect(() => {
          expect(hejmdal.isDone());
          expect(mock.getErrorLog().args).to.have.length(1);
        })
        .expect('location', constants.pages.generalError)
        .expect(303);
    });
  });
});
