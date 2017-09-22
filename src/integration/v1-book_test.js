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

describe('Endpoint /v1/book', () => {
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
    describe('GET /v1/book/:pid', () => {
      it('should handle non-existing PID', done => {
        const pid = '12345:ost:3984';
        const url = `/v1/book/${pid}`;
        webapp.get(url)
          .expect(404)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/unknown pid/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('resource');
              expect(error.meta.resource).to.equal(url);
            });
          })
          .end(done);
      });
      it('should give a book as result', done => {
        const pid = '870970-basis:53188931';
        const url = `/v1/book/${pid}`;
        webapp.get(url)
          .expect(200)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/book-links-out.json');
              expect(links.self).to.equal(url);
              expect(links.cover).to.equal(`/v1/image/${pid}`);
              expectValidate(data, 'schemas/book-data-out.json');
              expect(data).to.deep.equal({
                pid: '870970-basis:53188931',
                unit_id: 'unit:22125672',
                work_id: 'work:20137979',
                bibliographic_record_id: 53188931,
                creator: 'Jens Blendstrup',
                title: 'Havelågebogen',
                title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
                taxonomy_description: 'Fotografier af havelåger sat sammen med korte tekster, der fantaserer over, hvem der mon bor inde bag lågerne',
                bibliographic_description: 'Noget med låger',
                pages: 645,
                loan_count: 1020,
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
          })
          .end(done);
      });
    });
  });
  describe('Internal endpoint', () => {
    const internal = request(`http://localhost:${config.server.internalPort}`);
    describe('PUT /v1/book/:pid', () => {
      it('should reject wrong content type', done => {
        const location = '/v1/book/123456-basis:987654321';
        const contentType = 'text/plain';
        internal.put(location)
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
          })
          .end(done);
      });
      it('should reject broken input', done => {
        const broken = require('fixtures/broken-book.json');
        const location = '/v1/book/123456-basis:987654321';
        const contentType = 'application/json';
        internal.put(location)
          .type(contentType)
          .send(broken)
          .expect(400)
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
              expect(problems).to.deep.include('field pid is the wrong type');
              expect(problems).to.deep.include('field bibliographicRecordId is the wrong type');
              expect(problems).to.deep.include('field loancount is the wrong type');
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
          .end(done);
      });
      it('should reject address that does not agree with PID', done => {
        const harryPotter = require('fixtures/rowling-harry-potter-de-vises-sten.json');
        const pid = harryPotter.pid;
        const wrongPid = '12335-basic:9782637';
        const location = `/v1/book/${wrongPid}`;
        const contentType = 'application/json';
        internal.put(location)
          .type(contentType)
          .send(harryPotter)
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/mismatch beetween book pid and location/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.equal(`Expected PID ${wrongPid} but found ${pid}`);
            });
          })
          .end(done);
      });
      it('should create a new book', done => {
        const harryPotter = require('fixtures/rowling-harry-potter-de-vises-sten.json');
        const pid = harryPotter.pid;
        const location = `/v1/book/${pid}`;
        internal.put(location)
          .type('application/json')
          .send(harryPotter)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links).to.have.property('self');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/book-data-out.json');
              expect(data.pid).to.equal(pid);
            });
          })
          .expect('location', location)
          .expect(201)
          .then(() => {
            webapp.get(location)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/book-links-out.json');
                  expect(links.self).to.equal(location);
                  expectValidate(data, 'schemas/book-data-out.json');
                  expect(data.pid).to.equal(pid);
                  expect(data.unit_id).to.equal('unit:843773');
                  expect(data.work_id).to.equal('work:695663');
                  expect(data.bibliographic_record_id).to.equal(22629344);
                  expect(data.creator).to.equal('Joanne K. Rowling');
                  expect(data.title).to.equal('Harry Potter og De Vises Sten');
                  expect(data.title_full).to.equal('Harry Potter og De Vises Sten');
                  expect(data.type).to.equal('Bog');
                  expect(data.work_type).to.equal('book');
                  expect(data.items).to.equal(2690);
                  expect(data.libraries).to.equal(154);
                  expect(data.pages).to.equal(303);
                  expect(data.loan_count).to.equal(20811);
                });
              })
              .expect(200)
              .end(done);
          })
          .catch(done);
      });
      it('should replace a book in the database', done => {
        const harryPotter = require('fixtures/rowling-harry-potter-de-vises-sten.json');
        const pid = '870970-basis:53188931';
        harryPotter.pid = pid;
        const location = `/v1/book/${pid}`;
        internal.put(location)
          .type('application/json')
          .send(harryPotter)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/book-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/book-data-out.json');
              expect(data.pid).to.equal(pid);
              expect(data.creator).to.equal('Joanne K. Rowling');
              expect(data.unit_id).to.equal('unit:843773');
            });
          })
          .expect(200)
          .expect('location', location)
          .then(() => {
            webapp.get(location)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/book-links-out.json');
                  expect(links.self).to.equal(location);
                  expectValidate(data, 'schemas/book-data-out.json');
                  expect(data.pid).to.equal(pid);
                  expect(data.creator).to.equal('Joanne K. Rowling');
                  expect(data.loan_count).to.equal(20811);
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
