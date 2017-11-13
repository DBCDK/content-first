'use strict';

const mock = require('./mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const {expectSuccess, expectFailure} = require('./output-verifiers');
const resolve = require('resolve');

describe('Endpoint /v1/image', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.beforeEach();
  });
  afterEach(() => {
    mock.afterEach();
  });
  describe('Public endpoint', () => {
    describe('GET /v1/image/:pid', () => {
      it('should handle non-existing cover image', () => {
        const url = '/v1/image/does:not:exist';
        return webapp.get(url)
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
          });
      });
    });
    describe('GET /v1/image/:pid', () => {
      it('should give a cover image', () => {
        return webapp.get('/v1/image/already-seeded-pid-blendstrup-havelaagebogen')
          .expect(200)
          .expect('Content-Type', /image\/jpeg/)
          .expect('Content-Length', '29839');
      });
    });
  });
  describe('Internal endpoint', () => {
    const hidden = request(mock.internal);
    describe('PUT /v1/image/:pid', () => {
      it('should reject wrong content type', () => {
        const location = '/v1/image/870970-basis:22629344';
        const contentType = 'application/json';
        return hidden.put(location)
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
          });
      });
      it('should reject broken image', () => {
        const location = '/v1/image/870970-basis:22629344';
        const contentType = 'image/jpeg';
        return hidden.put(location)
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
          });
      });
      it('should store an image in the database', done => {
        const location = '/v1/image/870970-basis:22629344';
        readFileAsync(resolve.sync('fixtures/870970-basis-22629344.jpg'))
          .then(contents => {
            return hidden.put(location)
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
        const location = '/v1/image/already-seeded-pid-blendstrup-havelaagebogen';
        readFileAsync(resolve.sync('fixtures/870970-basis-53188931.jpg'))
          .then(contents => {
            return hidden.put(location)
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
