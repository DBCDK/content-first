// This is a placeholder to give an idea of how to test the API.
'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
// const expectSuccess = require('output-verifiers').expectSuccess;
const expectFailure = require('./output-verifiers').expectFailure;
// const expectValidate = require('output-verifiers').expectValidate;

describe('endpoints', () => {
  const webapp = request(`http://localhost:${config.server.port}`);
  before(done => {
    dbUtil.dropAll()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        done();
      })
      .catch(done);
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
      const url = '/v1/image/does:not:exist';
      webapp.get(url)
        .expect(404)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error).to.have.property('title');
            expect(error.title).to.match(/unknown image/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('resource');
            expect(error.meta.resource).to.equal(url);
          });
        })
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
  describe('GET /v1/books', () => {
    it('should handle no pids', done => {
      webapp.get('/v1/books')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(/must supply at least one PID/)
        .end(done);
    });
    it('should handle non-existing pids', done => {
      webapp.get('/v1/books')
        .end(done);
    });
    it('should give a list of existing books');
  });
});
