/* eslint-env mocha */
'use strict';

// const {expect} = require('chai');
// const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
// const {expectSuccess, expectValidate} = require('./output-verifiers');
// const mock = require('./mock-server');

describe('OpenPlatform authentication', () => {
//  const webapp = request(mock.external);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
    logger.log.debug('Database is now seeded.');
  });
  describe('Public endpoint', () => {
    describe('GET /v1/openplatform-token', () => {
      it('should return an access token');
      it('should return an existing access token if not expired');
    });
  });
});
