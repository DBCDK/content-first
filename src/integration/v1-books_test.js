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

describe('Endpoint /v1/books', () => {
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
  describe('GET /v1/books?pids=...', () => {
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
              description: 'Dette er en beskrivelse',
              pages: 645,
              published_year: 1,
              published_month: 1,
              published_day: 1,
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
