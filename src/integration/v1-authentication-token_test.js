/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {external} = require('./mock-server');
const request = require('supertest');
const nock = require('nock');
const authenticator = require('server/authenticator');
const config = require('server/config');
const {expect} = require('chai');
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');

const s_OneMonth = 30 * 24 * 60 * 60;

describe('OpenPlatform authentication', () => {
  const webapp = request(external);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
  });
  describe('Public endpoint', () => {
    describe('GET /v1/authentication-token', () => {
      it('should return an access token', () => {
        // Arrange.
        authenticator.clear();
        const token = 'e6cd4988cf2933f2868450a0b2ec218f5c141432';
        const remote = nock(config.auth.url).post(config.auth.apiGetToken).reply(200, {
          token_type: 'bearer',
          access_token: token,
          expires_in: s_OneMonth
        });
        // Act.
        const url = '/v1/authentication-token';
        return webapp.get(url)
          // Assert.
          .expect(200)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/authentication-links-out.json');
              expectValidate(data, 'schemas/authentication-data-out.json');
            });
            expect(remote.isDone()).to.be.true;
          });
      });
      it('should return an error if authenticator unreachable', () => {
        // Arrange.
        authenticator.clear();
        const remote = nock(config.auth.url).post(config.auth.apiGetToken).reply(500);
        // Act.
        const url = '/v1/authentication-token';
        return webapp.get(url)
          // Assert.
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/authentication.service communication failed/i);
            });
            expect(remote.isDone()).to.be.true;
          })
          .expect(503);
      });
    });
  });
});
