/* eslint-env mocha */
'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const expectFailure = require('./output-verifiers').expectFailure;
const expectSuccess = require('./output-verifiers').expectSuccess;
const expectValidate = require('./output-verifiers').expectValidate;

describe('User data', () => {
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
    describe('GET /v1/users/:uuid', () => {
      it('should reject unknown user', done => {
        const user = 'unknown';
        const location = `/v1/users/${user}`;
        webapp.get(location)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/unknown user/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('resource');
              expect(error.meta.resource).to.equal(location);
            });
          })
          .end(done);
      });
      it('should retrieve existing user data', done => {
        const user = 'cd3cc362-d29c-4d40-8662-458664251e52';
        const location = `/v1/users/${user}`;
        webapp.get(location)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/user-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/user-data-out.json');
              expect(data.uuid).to.equal(user);
            });
          })
          .expect(200)
          .end(done);
      });
    });
  });
});
