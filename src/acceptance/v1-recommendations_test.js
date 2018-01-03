/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const {expect} = require('chai');
const request = require('supertest');
const {
  expectSuccess,
  expectFailure,
  expectValidate
} = require('fixtures/output-verifiers');

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

    it('should return a list of books that include all specified tags', () => {
      const tags = [205, 144, 146];
      const url = `/v1/recommendations?tags=${tags.join()}`;
      return webapp
        .get(url)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/books-links-out.json');
            expect(links.self).to.equal(url);
            expectValidate(data, 'schemas/books-data-out.json');
            expect(data).to.have.length(1);
            expectValidate(data[0].links, 'schemas/book-links-out.json');
            const book = data[0].book;
            expectValidate(book, 'schemas/book-data-out.json');
          });
        })
        .expect(200);
    });
  });
});
