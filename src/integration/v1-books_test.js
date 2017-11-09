'use strict';

const mock = require('./mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');

describe('Endpoint /v1/books', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.beforeEach();
  });
  afterEach(() => {
    mock.afterEach();
  });

  describe('Public endpoint', () => {

    describe('GET /v1/books?pids=...', () => {

      it('should handle no PIDs', () => {
        return webapp.get('/v1/books')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect(/must supply at least one PID/);
      });

      it('should handle non-existing pids', () => {
        const pid = 123456789;
        const url = `/v1/books?pids=${pid}`;
        return webapp.get(url)
          .expect(404)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/unknown pids/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('resource');
              expect(error.meta.resource).to.equal(url);
            });
          });
      });

      it('should give a list of existing books', () => {
        const pid = '870970-basis:53188931';
        const url = `/v1/books?pids=${pid}`;
        return webapp.get(url)
          .expect(200)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/books-links-out.json');
              expect(links.self).to.equal(url);
              expectValidate(data, 'schemas/books-data-out.json');
              expect(data).to.have.length(1);
              expectValidate(data[0].links, 'schemas/book-links-out.json');
              expect(data[0].links.self).to.equal(`/v1/book/${pid}`);
              expect(data[0].links.cover).to.equal(`/v1/image/${pid}`);
              expectValidate(data[0].book, 'schemas/book-data-out.json');
              expect(data[0].book).to.deep.equal({
                pid: '870970-basis:53188931',
                unit_id: 'unit:22125672',
                work_id: 'work:20137979',
                bibliographic_record_id: 53188931,
                creator: 'Jens Blendstrup',
                title: 'Havelågebogen',
                title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
                taxonomy_description: 'Fotografier af havelåger sat sammen med korte tekster, der fantaserer over, hvem der mon bor inde bag lågerne',
                description: 'Noget med låger',
                pages: 645,
                loans: 1020,
                type: 'Bog',
                work_type: 'book',
                language: 'Dansk',
                items: 196,
                libraries: 80,
                first_edition_year: 2017,
                genre: 'humor',
                subject: 'billedværker, humor, fotografier',
                literary_form: 'digte, fiktion'
              });
            });
          });
      });
    });
  });

  describe('Internal endpoint', () => {
    const hidden = request(mock.internal);

    describe('PUT /v1/books', () => {

      it('should reject wrong content type', () => {
        const contentType = 'text/plain';
        return hidden.put('/v1/books')
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
        return hidden.put('/v1/books')
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
            return webapp.get('/v1/books/already-seeded-pid-carter-mordoffer')
              .expect(200);
          });
      });

      it('should discard partly-broken input and maintain current books', () => {
        const broken = require('fixtures/partly-broken-books.json');
        return hidden.put('/v1/books')
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
              expect(problems).to.deep.include('field bibliographicRecordId is required');
              expect(problems).to.deep.include('field loans is required');
              expect(problems).to.deep.include('field workId is required');
              expect(problems).to.deep.include('field creator is required');
              expect(problems).to.deep.include('field title is required');
              expect(problems).to.deep.include('field titleFull is required');
              expect(problems).to.deep.include('field type is required');
              expect(problems).to.deep.include('field workType is required');
              expect(problems).to.deep.include('field language is required');
              expect(problems).to.deep.include('field image_detail is required');
              expect(problems).to.deep.include('field items is required');
              expect(problems).to.deep.include('field libraries is required');
              expect(problems).to.deep.include('field pages is required');
            });
          })
          .expect(400)
          .then(() => {
            const pid = '870970-basis:53188931';
            const url = `/v1/book/${pid}`;
            return webapp.get(url).expect(200);
          });
      });

      it('should discard input with duplicate PIDs and maintain current books', () => {
        const broken = require('fixtures/duplicate-pid-books.json');
        return hidden.put('/v1/books')
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
            const pid = '870970-basis:53188931';
            const url = `/v1/book/${pid}`;
            return webapp.get(url).expect(200);
          });
      });

      it('should accept valid input and replace all books', () => {
        const books = require('fixtures/two-books.json');
        return hidden.put('/v1/books')
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
            return webapp.get(url)
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
            const pid = '870970-basis:53188931';
            const url = `/v1/book/${pid}`;
            return webapp.get(url).expect(404);
          });
      });
    });
  });
});
