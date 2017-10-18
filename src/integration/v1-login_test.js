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

describe('User login', () => {
//  const webapp = request(mock.external);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
    logger.log.debug('Database is now seeded.');
  });
  describe('Public endpoint', () => {
    describe('GET /v1/login?token=:token&id=:id', () => {
      it('should reject malformed data');
      it('should reject invalid token or id');
      it('should return user info');
    });
  });
});
