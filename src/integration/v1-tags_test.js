'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const expectSuccess = require('./output-verifiers').expectSuccess;
const expectFailure = require('./output-verifiers').expectFailure;
const expectValidate = require('./output-verifiers').expectValidate;

describe('Endpoint /v1/tags', () => {
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
  describe('Public endpoint', () => {
    describe('GET /v1/tags/:pid', () => {
      it('should return existing tags for a specific PID', done => {
        const pid = '870970-basis:52947804';
        const location = `/v1/tags/${pid}`;
        webapp.get(location)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data).to.deep.equal({
                pid,
                tags: [44, 46, 49, 84, 85, 89, 90, 91, 92, 94, 96, 98, 99, 100, 103, 221, 222, 223, 224, 229, 234, 241, 251, 255, 256, 271, 281, 302, 318, 332]
              });
            });
          })
          .expect(200)
          .end(done);
      });
    });
  });
  describe('Internal endpoint', () => {
    const internal = request(`http://localhost:${config.server.internalPort}`);
    describe('POST /v1/tags', () => {
      it('should reject wrong content type', done => {
        const contentType = 'text/plain';
        internal.post('/v1/tags')
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
      it('should reject bad input', done => {
        const broken = require('fixtures/broken-tag-entry.json');
        internal.post('/v1/tags')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/malformed tags data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('field pid is the wrong type');
              expect(problems).to.deep.include('field selected is required');
            });
          })
          .expect(400)
          .end(done);
      });
      it('should create tags for new PID', done => {
        const tags = require('fixtures/tag-entry.json');
        const pid = tags.pid;
        const location = `/v1/tags/${pid}`;
        internal.post('/v1/tags')
          .type('application/json')
          .send(tags)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data).to.deep.equal({
                pid,
                tags: [49, 55, 56, 90, 221, 223, 224, 230, 234, 281, 302, 313]
              });
            });
          })
          .expect('location', location)
          .expect(201)
          .end(done);
      });
      it('should update tags for existing PID', done => {
        const tags = require('fixtures/carter-mordoffer-tags');
        const pid = tags.pid;
        const location = `/v1/tags/${tags.pid}`;
        internal.post('/v1/tags')
          .type('application/json')
          .send({pid, selected: ['1', '2']})
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data).to.deep.equal({
                pid,
                tags: [1, 2, 44, 46, 49, 84, 85, 89, 90, 91, 92, 94, 96, 98, 99, 100, 103, 221, 222, 223, 224, 229, 234, 241, 251, 255, 256, 271, 281, 302, 318, 332]
              });
            });
          })
          .expect('location', location)
          .expect(201)
          .end(done);
      });
    });
    describe('DELETE /v1/tags/:pid', () => {
      it('should clear all tags for a specific PID', done => {
        const pid = '870970-basis:52947804';
        const location = `/v1/tags/${pid}`;
        internal.del(location)
          .expect(204)
          .then(() => {
            webapp.get(location)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/tags-links-out.json');
                  expect(links.self).to.equal(location);
                  expectValidate(data, 'schemas/tags-data-out.json');
                  expect(data).to.deep.equal({
                    pid,
                    tags: []
                  });
                });
              })
              .expect(200)
              .end(done);
          })
          .catch(done);
      });
    });
  });
});
