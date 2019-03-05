/* eslint-env mocha */
'use strict';

const config = require('server/config');
const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const nock = require('nock');
const {
  expectSuccess,
  expectFailure,
  expectValidate
} = require('fixtures/output-verifiers');

describe('Endpoint /v1/books', () => {
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
    describe('GET /v1/books?pids=...', () => {
      it('should handle no PIDs', () => {
        return webapp
          .get('/v1/books')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect(/must supply at least one PID/);
      });

      it('should handle non-existing pids', () => {
        nock(config.auth.url)
          .filteringRequestBody(() => '*')
          .post('/oauth/token', '*')
          .reply(200, {access_token: 'accesstoken'});
        nock(config.login.openplatformUrl)
          .filteringRequestBody(() => '*')
          .post('/work', '*')
          .reply(200, {
            data: [{dcTitle: ['Error: unknown/missing/inaccessible record']}]
          });
        const pid = 123456789;
        const url = `/v1/books?pids=${pid}`;
        return webapp
          .get(url)
          .expect(200)
          .expect(res => {
            expect(res.body.failed).to.have.length(1);
          });
      });

      it('should give a list of existing books', () => {
        nock(config.auth.url)
          .filteringRequestBody(() => '*')
          .post('/oauth/token', '*')
          .reply(200, {access_token: 'accesstoken'});
        nock(config.login.openplatformUrl)
          .filteringRequestBody(() => '*')
          .post('/work', '*')
          .reply(200, {data: [{dcTitle: ['havelaagebogen']}]});
        const pid = 'already-seeded-pid-blendstrup-havelaagebogen';
        const url = `/v1/books?pids=${pid}`;
        return webapp
          .get(url)
          .expect(200)
          .expect(res => {
            expect(res.body.data).to.have.length(1);
            expect(res.body.data[0].book.taxonomy_description).to.equal(
              'Fotografier af havelåger sat sammen med korte tekster, der fantaserer over, hvem der mon bor inde bag lågerne'
            );
            expect(res.body.data[0].book.title).to.equal('havelaagebogen');
          });
      });
    });
  });

  describe('Internal endpoint', () => {
    const hidden = request(mock.internal);

    describe('PUT /v1/books', () => {
      it('should reject wrong content type', () => {
        const contentType = 'text/plain';
        return hidden
          .put('/v1/books')
          .type(contentType)
          .send('broken')
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/provided as application\/json/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/text\/plain .*not supported/i);
            });
          });
      });

      it('should discard broken input and maintain current books', () => {
        return hidden
          .put('/v1/books')
          .type('application/json')
          .send('{"id": "1234"}')
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed book data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
            });
          })
          .expect(400)
          .then(() => {
            return webapp
              .get('/v1/book/already-seeded-pid-martin-ridder')
              .expect(200);
          });
      });

      it('should discard partly-broken input and maintain current books', () => {
        const broken = require('fixtures/partly-broken-books.json');
        return hidden
          .put('/v1/books')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed book data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('field pid is required');
              expect(problems).to.deep.include(
                'field bibliographicRecordId is required'
              );
              expect(problems).to.deep.include('field loans is required');
              expect(problems).to.deep.include('field workId is required');
              expect(problems).to.deep.include('field creator is required');
              expect(problems).to.deep.include('field title is required');
              expect(problems).to.deep.include('field titleFull is required');
              expect(problems).to.deep.include('field type is required');
              expect(problems).to.deep.include('field workType is required');
              expect(problems).to.deep.include('field language is required');
              expect(problems).to.deep.include('field cover is required');
              expect(problems).to.deep.include('field items is required');
              expect(problems).to.deep.include('field libraries is required');
              expect(problems).to.deep.include('field pages is required');
            });
          })
          .expect(400)
          .then(() => {
            const pid = 'already-seeded-pid-blendstrup-havelaagebogen';
            const url = `/v1/book/${pid}`;
            return webapp.get(url).expect(200);
          });
      });

      it('should discard input with duplicate PIDs and maintain current books', () => {
        const broken = require('fixtures/duplicate-pid-books.json');
        return hidden
          .put('/v1/books')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/duplicate pid/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/pid .+ duplicated/i);
            });
          })
          .expect(400)
          .then(() => {
            const pid = 'already-seeded-pid-blendstrup-havelaagebogen';
            const url = `/v1/book/${pid}`;
            return webapp.get(url).expect(200);
          });
      });

      it('should accept valid input and replace all books', () => {
        const books = require('fixtures/two-books.json');
        return hidden
          .put('/v1/books')
          .type('application/json')
          .send(books)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/books-links-out.json');
              expect(links.self).to.equal('/v1/books');
              expectValidate(data, 'schemas/put-books-data-out.json');
              expect(data).to.match(/2 books created/i);
            });
          })
          .expect(200)
          .then(() => {
            const pid = 'pid-new-book-1';
            const url = `/v1/book/${pid}`;
            return webapp
              .get(url)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/book-links-out.json');
                  expect(links.self).to.equal(url);
                  expectValidate(data, 'schemas/book-data-out.json');
                  expect(data.creator).to.equal('Author One');
                  expect(data.description).to.equal('One book among many');
                });
              })
              .expect(200);
          })
          .then(() => {
            const pid = 'already-seeded-pid-blendstrup-havelaagebogen';
            const url = `/v1/book/${pid}`;
            return webapp.get(url).expect(404);
          });
      });
    });
  });
});
