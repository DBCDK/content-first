// This is a placeholder to give an idea of how to test the API.
'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);

describe('endpoints', () => {
  const webapp = request(`http://localhost:${config.server.port}`);
  before(done => {
    done();
  });
  beforeEach(done => {
    dbUtil.clear()
      .then(() => {
        return knex.seed.run();
      })
      .then(() => {
        logger.log.debug('Database is now seeded.');
      })
      .then(() => {
        done();
      })
      .catch(errors => {
        logger.log.error(`Could not update database to latest version, terminating: ${errors}`);
        done(errors);
      });
  });
  describe('GET /api', () => {
    it('should give list with one element', done => {
      webapp.get('/api')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.deep.equal([{id: 1, name: 'spændende'}]);
        })
        .end(done);
    });
  });
  describe('POST /api', () => {
    it('should return location', done => {
      const location = '/api/2';
      webapp.post('/api')
        .send({name: 'ost'})
        .expect(201)
        .expect('Content-Type', /json/)
        .expect('location', location)
        .end(done);
    });
  });
});
