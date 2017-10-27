/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {expect} = require('chai');
const tcp = require('__/tcp');

describe('tcp', () => {
  describe('normalizePort', () => {
    it('should return null for wrong values', () => {
      expect(tcp.normalizePort(-1)).to.be.null;
      expect(tcp.normalizePort(-32768)).to.be.null;
    });
    it('should return integer for a proper string', () => {
      expect(tcp.normalizePort(' 080 ')).to.equal(80);
    });
  });
});
