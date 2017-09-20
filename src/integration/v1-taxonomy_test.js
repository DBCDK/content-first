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

describe('Endpoint /v1/taxonomy', () => {
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
  describe('Internal endpoint', () => {
    const internal = request(`http://localhost:${config.server.internalPort}`);
    describe('PUT /v1/taxonomy', () => {
      it('should reject wrong content type', done => {
        const contentType = 'text/plain';
        internal.put('/v1/taxonomy')
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
        const broken = require('fixtures/broken-taxonomy.json');
        internal.put('/v1/taxonomy')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed taxonomy/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('field 0.id is the wrong type');
              expect(problems).to.deep.include('field 0.title is the wrong type');
              expect(problems).to.deep.include('field 0.items.0.id is the wrong type');
              expect(problems).to.deep.include('field 0.items.0.items.0.title is the wrong type');
            });
          })
          .expect(400)
          .end(done);
      });
      it('should reject non-integer and clashing ids', done => {
        const broken = require('fixtures/broken-taxonomy-non-integer.json');
        internal.put('/v1/taxonomy')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed taxonomy/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/ids must be unique integers/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('Cannot convert foo to an integer');
              expect(problems).to.deep.include('Cannot convert bar to an integer');
              expect(problems).to.deep.include('Cannot convert quux to an integer');
              expect(problems).to.deep.include('Id 3 occurs more than once');
              expect(problems).to.deep.include('Id 4 occurs more than once');
            });
          })
          .expect(400)
          .end(done);
      });
      it('should update taxonomy', done => {
        const taxonomy = require('fixtures/taxonomi.json');
        const output = require('fixtures/taxonomy-out.json');
        const location = '/v1/taxonomy';
        internal.put(location)
          .type('application/json')
          .send(taxonomy)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/taxonomy-links-out.json');
              expect(links.self).to.equal('/v1/taxonomy');
              expectValidate(data, 'schemas/taxonomy-data-out.json');
              expect(data).to.deep.equal(output);
            });
          })
          .expect(200)
          .then(() => {
            webapp.get(location)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/taxonomy-links-out.json');
                  expect(links.self).to.equal(location);
                  expectValidate(data, 'schemas/taxonomy-data-out.json');
                  expect(data).to.deep.equal(output);
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
