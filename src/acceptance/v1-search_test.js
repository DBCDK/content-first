/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess} = require('fixtures/output-verifiers');

describe('Endpoint /v1/search', () => {

  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
  });

  afterEach(function () {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('Public endpoint', () => {
    describe('GET /v1/search?q=...', () => {
      it('should handle search in title, including stemming', () => {
        const url = '/v1/search?q=riddere';
        return webapp.get(url)
          .expect(200)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(data).to.have.lengthOf(1);
              expect(data[0].title).to.equal('Den herreløse ridder');
            });
          });
      });
      it('should handle search in creator', () => {
        const url = '/v1/search?q=blendstrup';
        return webapp.get(url)
          .expect(200)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(data).to.have.lengthOf(1);
              expect(data[0].creator).to.equal('Jens Blendstrup');
            });
          });
      });
    });
  });
});
