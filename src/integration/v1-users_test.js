/* eslint-env mocha */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const config = require('server/config');
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('User data', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
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
              expect(data).to.deep.equal({
                name: 'Jens Godfredsen',
                gender: 'm',
                birth_year: 1971,
                authors: ['Ib Michael', 'Helle Helle'],
                atmosphere: ['Realistisk']
              });
            });
          })
          .expect(200)
          .end(done);
      });
    });
  });
});
