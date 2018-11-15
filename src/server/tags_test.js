/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const tags = require('./tags');

describe('tags', () => {
  describe('parsingTagsInjection', () => {
    const wrongTags = require('fixtures/broken-tag-entry.json');
    it('should complain about missing or wrong values in JSON', () => {
      return expect(tags.parsingTagsInjection(wrongTags)).to.be.rejected.then(
        error => {
          expect(error).to.have.property('title');
          expect(error.title).to.match(/does not adhere to JSON schema/i);
          expect(error).to.have.property('meta');
          expect(error.meta).to.have.property('problems');
          const problems = error.meta.problems;
          expect(problems).to.be.an('array');
          expect(problems).to.deep.include('field pid is the wrong type');
          expect(problems).to.deep.include('field selected is required');
        }
      );
    });
    it('should fill in all values from JSON', () => {
      const goodTags = require('fixtures/tag-entry.json');
      return expect(tags.parsingTagsInjection(goodTags)).to.become({
        pid: '870970-basis:53187404',
        tags: [
          {id: 49, score: 1},
          {id: 55, score: 1},
          {id: 56, score: 1},
          {id: 90, score: 1},
          {id: 221, score: 1},
          {id: 223, score: 1},
          {id: 224, score: 1},
          {id: 230, score: 1},
          {id: 234, score: 1},
          {id: 281, score: 1},
          {id: 302, score: 1},
          {id: 313, score: 1}
        ]
      });
    });
  });
});
