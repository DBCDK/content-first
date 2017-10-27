/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {expect} = require('chai');
const parameters = require('__/parameters');

describe('parameters', () => {
  describe('parseList', () => {
    it('should return null for no values', () => {
      expect(parameters.parseList('')).to.be.null;
    });
    it('should return list from single values', () => {
      expect(parameters.parseList('123')).to.deep.equal(['123']);
    });
    it('should return list from comma-separated values', () => {
      expect(parameters.parseList('foo,bar,quux')).to.deep.equal(['foo', 'bar', 'quux']);
    });
    it('should return list from plus-separated values', () => {
      expect(parameters.parseList('123+456')).to.deep.equal(['123', '456']);
    });
  });
});
