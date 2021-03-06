/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectValidate} = require('fixtures/output-verifiers');

describe('Statistics API', () => {
  const internalWebapp = request(mock.internal);
  const externalWebapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('/v1/stats', () => {
    it('should give statistics about private contents', () => {
      // Arrange.
      const location = '/v1/stats';
      // Act.
      return (
        internalWebapp
          .get(location)
          .set('Accept', 'application/json')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/statistics-out.json');
              // Only one of the seeded cookies should survive implicit
              // cleanup done by /stats.
              expect(data.users['logged-in']).to.equal(2);
              // Books & Tags.
              expect(data.books.total).to.equal(2);
              expect(data.tags.total).to.equal(52);
              expect(data.tags.pids).to.equal(2);
              expect(data.tags.min).to.equal(22);
              expect(data.tags.max).to.equal(30);
            });
          })
          .expect(200)
      );
    });
  });

  describe('/v1/stats', () => {
    it('should give statistics about public contents', () => {
      // Arrange.
      const location = '/v1/stats';
      // Act.
      return (
        externalWebapp
          .get(location)
          .set('Accept', 'application/json')
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/public-statistics-out.json');
              expect(data.books.total).to.equal(2);
            });
          })
          .expect(200)
      );
    });
  });
});
