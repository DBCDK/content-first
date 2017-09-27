'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const expectSuccess = require('./output-verifiers').expectSuccess;
const expectFailure = require('./output-verifiers').expectFailure;
const resolve = require('resolve');

describe('Endpoint /v1/image', () => {
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
    describe('GET /v1/image/:pid', () => {
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
    describe('GET /v1/image/:pid', () => {
      it('should give a cover image', done => {
        webapp.get('/v1/image/870970-basis:53188931')
          .expect(200)
          .expect('Content-Type', /image\/jpeg/)
          .expect('Content-Length', '29839')
          .end(done);
      });
    });
  });
  describe('Internal endpoint', () => {
    const internal = request(`http://localhost:${config.server.internalPort}`);
    describe('PUT /v1/image/:pid', () => {
      it('should reject wrong content type', done => {
        const location = '/v1/image/870970-basis:22629344';
        const contentType = 'application/json';
        internal.put(location)
          .type(contentType)
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/unsupported image type/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/content.type application\/json.*not supported/i);
            });
          })
          .end(done);
      });
      it('should reject broken image', done => {
        const location = '/v1/image/870970-basis:22629344';
        const contentType = 'image/jpeg';
        internal.put(location)
          .type(contentType)
          .send('broken image data')
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/corrupted image data/i);
            });
          })
          .end(done);
      });
      it('should store an image in the database', done => {
        const location = '/v1/image/870970-basis:22629344';
        readFileAsync(resolve.sync('fixtures/870970-basis-22629344.jpg'))
          .then(contents => {
            return internal.put(location)
              .type('image/jpeg')
              .send(contents)
              .expect(201)
              .expect('location', location)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expect(links).to.have.property('self');
                  expect(links.self).to.equal(location);
                  expect(data).to.match(/created/i);
                });
              });
          })
          .then(() => {
            webapp.get(location)
              .expect(200)
              .expect('Content-Type', /image\/jpeg/)
              .expect('Content-Length', '30822')
              .end(done);
          })
          .catch(done);
      });
      it('should replace an image in the database', done => {
        const location = '/v1/image/870970-basis:53188931';
        readFileAsync(resolve.sync('fixtures/870970-basis-53188931.jpg'))
          .then(contents => {
            return internal.put(location)
              .type('image/jpeg')
              .send(contents)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expect(links).to.have.property('self');
                  expect(links.self).to.equal(location);
                  expect(data).to.match(/updated/i);
                });
              })
              .expect(200)
              .expect('location', location);
          })
          .then(() => {
            webapp.get(location)
              .expect('Content-Type', /image\/jpeg/)
              .expect('Content-Length', '29839')
              .expect(200)
              .end(done);
          })
          .catch(done);
      });
    });
  });
});
