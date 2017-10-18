'use strict';

const {expect} = require('chai');
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');

describe('Endpoint /v1/books', () => {
  const {external} = require('./mock-server');
  const webapp = request(external);
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
