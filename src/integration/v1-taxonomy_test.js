'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
// const expectSuccess = require('./output-verifiers').expectSuccess;
const expectFailure = require('./output-verifiers').expectFailure;
// const expectValidate = require('./output-verifiers').expectValidate;

describe('Endpoint /v1/taxonomy', () => {
  const webapp = request(`http://localhost:${config.server.port}`);
  before(async () => {
    await dbUtil.dropAll();
    await knex.migrate.latest();
  });
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
    logger.log.debug('Database is now seeded.');
  });
  describe('PUT /v1/taxonomy', () => {
    it('should reject wrong content type', done => {
      const contentType = 'text/plain';
      webapp.put('/v1/taxonomy')
        .type(contentType)
        .send('broken')
        .expect(400)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error).to.have.property('title');
            expect(error.title).to.match(/provided as application\/json/i);
            expect(error).to.have.property('detail');
            expect(error.detail).to.match(/text\/plain .*not supported/i);
          });
        })
        .end(done);
    });
    it('should reject bad input');
    it('should update taxonomy');
  });
});
