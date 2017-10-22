/* eslint-env mocha */
'use strict';

// const {expect} = require('chai');
const request = require('supertest');
const config = require('server/config');
// const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectSuccess, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('OpenPlatform authentication', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
  });
  describe('Public endpoint', () => {
    describe('GET /v1/authentication-token', () => {
      it('should return an access token', done => {
        const url = '/v1/authentication-token';
        webapp.get(url)
          .expect(200)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/authentication-links-out.json');
              expectValidate(data, 'schemas/authentication-data-out.json');
            });
          })
          .end(done);
      });
      it('should return an existing access token if not expired');
    });
  });
});
