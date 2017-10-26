/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {internal} = require('./mock-server');
const config = require('server/config');
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectValidate} = require('./output-verifiers');

describe('Statistics API', () => {
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
  });
  describe('Internal endpoint', () => {
    const webapp = request(internal);
    describe('/v1/stats', () => {
      it('should give statistics about users', () => {
        // Arrange.
        const location = '/v1/stats';
        // Act.
        return webapp.get(location)
          .set('Accept', 'application/json')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/statistics-out.json');
              // Users.
              expect(data.users.total).to.equal(1);
              // Only one of the seeded cookies should survive implicit
              // cleanup done by /stats.
              expect(data.users['loged-in']).to.equal(1);
              // Books.
              expect(data.books.total).to.equal(2);
            });
          })
          .expect(200);
      });
    });
  });
});
