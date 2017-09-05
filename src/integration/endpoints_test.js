// This is a placeholder to give an idea of how to test the API.
'use strict';

// const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);

describe('endpoints', () => {
  const webapp = request(`http://localhost:${config.server.port}`);
  before(done => {
    dbUtil.dropAll()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        done();
      });
  });
  beforeEach(done => {
    dbUtil.clear()
      .then(() => {
        return knex.seed.run();
      })
      .then(() => {
        logger.log.debug('Database is now seeded.');
        done();
      })
      .catch(errors => {
        logger.log.error(`Could not update database to latest version, terminating: ${errors}`);
        done(errors);
      });
  });
  describe('GET /v1/image', () => {
    it('should handle non-existing cover image', done => {
      webapp.get('/v1/image/does:not:exist')
        .expect(404)
        .end(done);
    });
  });
  describe('GET /v1/image', () => {
    it('should give a cover image', done => {
      webapp.get('/v1/image/870970-basis:53188931')
        .expect(200)
        .expect('Content-Type', /image\/jpeg/)
        .expect('Content-Length', '28130')
        .end(done);
    });
  });
});
