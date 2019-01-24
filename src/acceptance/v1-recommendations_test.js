/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {expectFailure} = require('fixtures/output-verifiers');

describe('Endpoint /v1/recommendations', () => {
  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('GET /v1/recommendations?tags=...', () => {
    it('should handle no tags', () => {
      const url = '/v1/recommendations?tags=';
      return webapp
        .get(url)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/tags expected/i);
            expect(error).to.have.property('detail');
            expect(error.detail).to.match(/supply at least one tag/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('resource');
            expect(error.meta.resource).to.equal(url);
          });
        })
        .expect(400);
    });
  });
});
