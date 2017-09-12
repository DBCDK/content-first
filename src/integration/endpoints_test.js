// This is a placeholder to give an idea of how to test the API.
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
const expectValidate = require('./output-verifiers').expectValidate;

describe('endpoints', () => {
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
  describe('PUT /v1/image', () => {
    it('should reject wrong content type', done => {
      const location = '/v1/image/870970-basis:22629344';
      const contentType = 'application/json';
      webapp.put(location)
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
      webapp.put(location)
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
      readFileAsync('src/fixtures/870970-basis-22629344.jpg')
        .then(contents => {
          return webapp.put(location)
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
            .expect('Content-Length', '29852')
            .end(done);
        })
        .catch(done);
    });
    it('should replace an image in the database', done => {
      const location = '/v1/image/870970-basis:53188931';
      readFileAsync('src/fixtures/870970-basis-53188931.jpg')
        .then(contents => {
          return webapp.put(location)
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
            .expect('Content-Length', '28130')
            .expect(200)
            .end(done);
        })
        .catch(done);
    });
  });
  describe('GET /v1/book', () => {
    it('should handle non-existing PID', done => {
      const pid = '12345:ost:3984';
      const url = `/v1/book/${pid}`;
      webapp.get(url)
        .expect(404)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error).to.have.property('title');
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
              description: 'Ingen beskrivelse',
              pages: 645,
              published_year: 2017,
              published_month: 2,
              published_day: 3,
              loan_count: 1020,
              type: 'Bog',
              work_type: 'book',
              language: 'Dansk',
              items: 196,
              libraries: 80
            });
          });
        })
        .end(done);
    });
  });
  describe('PUT /v1/book', () => {
    it('should reject wrong content type', done => {
      const location = '/v1/book/123456-basis:987654321';
      const contentType = 'text/plain';
      webapp.put(location)
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
    it('should reject broken input', done => {
      const broken = require('fixtures/wrong-book.json');
      const location = '/v1/book/123456-basis:987654321';
      const contentType = 'application/json';
      webapp.put(location)
        .type(contentType)
        .send(broken)
        .expect(400)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error).to.have.property('title');
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
      webapp.put(location)
        .type(contentType)
        .send(harryPotter)
        .expect(400)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error).to.have.property('title');
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
      webapp.put(location)
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
                expect(links).to.have.property('self');
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
      webapp.put(location)
        .type('application/json')
        .send(harryPotter)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expect(links).to.have.property('self');
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
                expect(links).to.have.property('self');
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
  describe('GET /v1/books', () => {
    it('should handle no PIDs', done => {
      webapp.get('/v1/books')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(/must supply at least one PID/)
        .end(done);
    });
    it('should handle non-existing pids', done => {
      const pid = 123456789;
      const url = `/v1/books?pids=${pid}`;
      webapp.get(url)
        .expect(404)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error).to.have.property('title');
            expect(error.title).to.match(/unknown pids/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('resource');
            expect(error.meta.resource).to.equal(url);
          });
        })
        .end(done);
    });
    it('should give a list of existing books', done => {
      const pid = '870970-basis:53188931';
      const url = `/v1/books?pids=${pid}`;
      webapp.get(url)
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
              description: 'Ingen beskrivelse',
              pages: 645,
              published_year: 2017,
              published_month: 2,
              published_day: 3,
              loan_count: 1020,
              type: 'Bog',
              work_type: 'book',
              language: 'Dansk',
              items: 196,
              libraries: 80
            });
          });
        })
        .end(done);
    });
  });
});
