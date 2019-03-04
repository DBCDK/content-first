/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const {expectSuccess, expectFailure} = require('fixtures/output-verifiers');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const coverTable = constants.covers.table;
const resolve = require('resolve');

const logged_in_cookie = mock.createLoginCookie(
  'valid-login-token-for-user-seeded-on-test-start'
);

describe('Endpoint /v1/image', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.resetting();
  });
  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });
  describe('Public endpoint', () => {
    describe('GET /v1/image/:pid', () => {
      it('should handle non-existing cover image', () => {
        const url = '/v1/image/does:not:exist';
        return webapp
          .get(url)
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
        return webapp
          .get('/v1/image/already-seeded-pid-blendstrup-havelaagebogen')
          .expect(200)
          .expect('Content-Type', /image\/jpeg/)
          .expect('Content-Length', '29839');
      });
    });
    describe('GET /v1/image/:pid/:width/:height', () => {
      it('should handle invalid width or height', () => {
        return webapp
          .get('/v1/image/already-seeded-pid-blendstrup-havelaagebogen/nan/100')
          .expect(404)
          .expect(res =>
            expectFailure(res.body, errors => {
              const error = errors[0];
              expect(error.title).to.equal('Invalid image dimensions');
              expect(error.detail).to.include(
                'Width and height must be numbers'
              );
            })
          );
      });
      it('should handle invalid image', () => {
        return webapp
          .get('/v1/image/not-an-image/100/100')
          .expect(404)
          .expect(res =>
            expectFailure(res.body, errors => {
              const error = errors[0];
              expect(error.title).to.equal('Unknown image');
              expect(error.detail).to.include('No image with id');
            })
          );
      });
      it('should return a rescaled image', () => {
        return webapp
          .get('/v1/image/already-seeded-pid-blendstrup-havelaagebogen/100/100')
          .expect(200)
          .expect('Content-Type', /image\/jpeg/);
        // .expect('Content-Length', '3415');
      });
      it('should save rescaled image in db', async () => {
        await webapp.get(
          '/v1/image/already-seeded-pid-blendstrup-havelaagebogen/100/100'
        );
        const cachedImage = await knex(coverTable)
          .where('pid', `already-seeded-pid-blendstrup-havelaagebogen-100-100`)
          .select();
        expect(cachedImage.length).to.equal(1);
        // expect(cachedImage[0].image.length).to.equal(3415);
        return webapp
          .get('/v1/image/already-seeded-pid-blendstrup-havelaagebogen/100/100')
          .expect(200)
          .expect('Content-Type', /image\/jpeg/);
        // .expect('Content-Length', '3415');
      });
    });
    describe('POST /v1/image/', () => {
      it('should reject POST if user not logged in', async () => {
        const location = '/v1/image/';
        return readFileAsync(
          resolve.sync('fixtures/870970-basis-22629344.jpg')
        ).then(contents => {
          return webapp
            .post(location)
            .type('image/jpeg')
            .send(contents)
            .expect(403);
        });
      });
      it('should reject wrong content type', () => {
        const location = '/v1/image/';
        const contentType = 'application/json';
        return webapp
          .post(location)
          .set('cookie', logged_in_cookie)
          .type(contentType)
          .expect(400);
      });
      it('should reject broken image', () => {
        const location = '/v1/image/';
        const contentType = 'image/jpeg';
        return webapp
          .post(location)
          .set('cookie', logged_in_cookie)
          .type(contentType)
          .send('broken image data')
          .expect(400);
      });
      it('should create image if user is logged in', async () => {
        const location = '/v1/image/';
        return readFileAsync(
          resolve.sync('fixtures/870970-basis-22629344.jpg')
        ).then(contents => {
          return webapp
            .post(location)
            .set('cookie', logged_in_cookie)
            .type('image/jpeg')
            .send(contents)
            .expect(201);
        });
      });
    });
  });
  describe('Internal endpoint', () => {
    const hidden = request(mock.internal);
    describe('PUT /v1/image/:pid', () => {
      it('should reject wrong content type', () => {
        const location = '/v1/image/870970-basis:22629344';
        const contentType = 'application/json';
        return hidden
          .put(location)
          .type(contentType)
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/unsupported image type/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(
                /content.type application\/json.*not supported/i
              );
            });
          });
      });
      it('should reject broken image', () => {
        const location = '/v1/image/870970-basis:22629344';
        const contentType = 'image/jpeg';
        return hidden
          .put(location)
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
            return hidden
              .put(location)
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
            webapp
              .get(location)
              .expect(200)
              .expect('Content-Type', /image\/jpeg/)
              .expect('Content-Length', '30822')
              .end(done);
          })
          .catch(done);
      });
      it('should replace an image in the database', done => {
        const location =
          '/v1/image/already-seeded-pid-blendstrup-havelaagebogen';
        readFileAsync(resolve.sync('fixtures/870970-basis-53188931.jpg'))
          .then(contents => {
            return hidden
              .put(location)
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
            webapp
              .get(location)
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
