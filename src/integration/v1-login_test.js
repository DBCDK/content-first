/* eslint-env mocha */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const nock = require('nock');
const config = require('server/config');
const authenticator = require('server/authenticator');
const constants = require('__/service/authentication-constants')();
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('User login', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
  });
  describe('Public endpoint', () => {
    describe('GET /v1/login', () => {
      it('should retrieve existing user data on valid cookie', () => {
        // Act.
        return webapp.get('/v1/login')
          .set('cookie', 'login-token=c32e314e-8f12-45e3-8b52-17aa87e7699d')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/user-links-out.json');
              expectValidate(data, 'schemas/user-data-out.json');
              expect(data).to.deep.equal({
                name: 'Jens Godfredsen',
                gender: 'm',
                birth_year: 1971,
                authors: ['Ib Michael', 'Helle Helle'],
                atmosphere: ['Realistisk']
              });
            });
          })
          .expect(200);
      });
      it('should redirect to remote login page on no cookie', () => {
        // Arrange.
        authenticator.clear();
        const token = '840e75ac9af8448898fe7f7c99198a7d';
        nock(config.auth.url).post(constants.apiGetToken).reply(200, {
          token_type: 'bearer',
          access_token: token,
          expires_in: constants.s_OneMonth
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
          })
          .expect(303);
      });
      it('should redirect to remote login page on non-existing cookie', () => {
        // Arrange.
        authenticator.clear();
        const token = '840e75ac9af8448898fe7f7c99198a7d';
        nock(config.auth.url).post(constants.apiGetToken).reply(200, {
          token_type: 'bearer',
          access_token: token,
          expires_in: constants.s_OneMonth
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
          })
          .expect(303);
      });
      it('should redirect to remote login page on expired cookie', () => {
        // Arrange.
        authenticator.clear();
        const token = 'a7d847c9481840e75ac9af98fe7f9198';
        nock(config.auth.url).post(constants.apiGetToken).reply(200, {
          token_type: 'bearer',
          access_token: token,
          expires_in: constants.s_OneMonth
        });
        // Act.
        return webapp.get('/v1/login')
          .set('cookie', 'login-token=deadbeef-dead-beef-dead-beefdeadbeef')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/login-links-out.json');
              const remote = `${config.login.url}/login?token=${token}`;
              expect(links.login).to.equal(remote);
              expectValidate(data, 'schemas/login-data-out.json');
              expect(data).to.equal(remote);
            });
          })
          .expect(303);
      });
      it('should handle failure to retrieve token', () => {
        // Arrange.
        authenticator.clear();
        nock(config.auth.url).post(constants.apiGetToken).reply(500);
        // Act.
        return webapp.get('/v1/login')
          // Assert.
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/authentication.service communication failed/i);
            });
          })
          .expect(503);
      });
    });
    describe('GET /hejmdal:token&id', () => {
      it('should retrieve user info and redirect & set valid cookie');
      it('should handle failure to retrieve info and redirect');
    });
    describe('POST /v1/logout', () => {
      it('should invalidate current cookie');
      it('should allow no current cookie');
    });
  });
});
