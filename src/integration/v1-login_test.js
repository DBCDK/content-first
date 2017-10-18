/* eslint-env mocha */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectSuccess, expectValidate} = require('./output-verifiers');

describe('User authentication', () => {
  const {external} = require('./mock-server');
  const webapp = request(external);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
    logger.log.debug('Database is now seeded.');
  });
  describe('Public endpoint', () => {
    describe('POST /v1/login', () => {
      it('should generate a random user identification', done => {
        let getUserDataUrl;
        let uuid;
        webapp.post('/v1/login')
          .send()
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/user-links-out.json');
              getUserDataUrl = links.self;
              expectValidate(data, 'schemas/user-data-out.json');
              uuid = data.uuid;
              expect(uuid).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            });
          })
          .expect(200)
          .then(() => {
            webapp.get(getUserDataUrl)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/user-links-out.json');
                  expect(links.self).to.equal(getUserDataUrl);
                  expectValidate(data, 'schemas/user-data-out.json');
                  expect(data.uuid).to.equal(uuid);
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
