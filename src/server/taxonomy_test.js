/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const taxonomy = require('./taxonomy');

describe('taxonomy', () => {
  describe('parsingTaxonomyInjection', () => {
    it('should complain about missing or wrong values in JSON', () => {
      const brokenTaxonomy = require('fixtures/broken-taxonomy.json');
      return expect(
        taxonomy.parsingTaxonomyInjection(brokenTaxonomy)
      ).to.be.rejected.then(error => {
        expect(error).to.have.property('title');
        expect(error.title).to.match(/does not adhere to JSON schema/i);
        expect(error).to.have.property('meta');
        expect(error.meta).to.have.property('problems');
        const problems = error.meta.problems;
        expect(problems).to.be.an('array');
        expect(problems).to.deep.include('field 0.id is the wrong type');
        expect(problems).to.deep.include('field 0.title is the wrong type');
        expect(problems).to.deep.include(
          'field 0.items.0.id is the wrong type'
        );
        expect(problems).to.deep.include(
          'field 0.items.0.items.0.title is the wrong type'
        );
      });
    });
    it('should reject non-integer and clashing ids', () => {
      const broken = require('fixtures/broken-taxonomy-non-integer.json');
      return expect(
        taxonomy.parsingTaxonomyInjection(broken)
      ).to.be.rejected.then(problems => {
        expect(problems).to.be.an('array');
        expect(problems).to.have.length(5);
        expect(problems).to.deep.include('Cannot convert foo to an integer');
        expect(problems).to.deep.include('Cannot convert bar to an integer');
        expect(problems).to.deep.include('Cannot convert quux to an integer');
        expect(problems).to.deep.include('Id 3 occurs more than once');
        expect(problems).to.deep.include('Id 4 occurs more than once');
      });
    });
    it('should transform input to normalised output', () => {
      const input = require('fixtures/good-taxonomy.json');
      const output = require('fixtures/taxonomy-out.json');
      return expect(taxonomy.parsingTaxonomyInjection(input)).to.become(output);
    });
  });
});
