/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const config = require('server/config');
const {expect} = require('chai');
const nock = require('nock');
// const {expectValidate, expectFailure} = require('./output-verifiers');
const Authenticator = require('./authentication-smaug');

const s_OneHour = 60 * 60;
const s_OneMonth = 30 * 24 * 60 * 60;

describe('Authentication connector', () => {
  describe('unreachable service', () => {
    // const auth = new Authenticator();
    it('should return an existing access token if not expired');
    it('should say there is no connection if new token is needed');
  });
  describe('connected', () => {
    const auth = new Authenticator();
    it('should say that everything is ok', () => {
      // Arrange.
      auth.clear();
      // Assert.
      expect(auth.isOk()).to.be.true;
    });
    it('should complain about wrong answer from authenticator', () => {
      // Arrange.
      auth.clear();
      const server = nock(config.auth.url).post('/oauth/token').reply(200, {
        answer: 'who are u?'
      });
      // Act.
      return auth.gettingToken()
        // Assert.
        .then(() => {
          return Promise.reject('Expected rejection');
        })
        .catch(error => {
          expect(server.isDone()).to.be.true;
          expect(error).to.have.property('title');
          expect(error.title).to.match(/does not adhere to JSON schema/i);
        });
    });
    it('should retrieve a new token when needed', () => {
      // Arrange.
      auth.clear();
      const token = '141432e6cd4988cf2933f2868450a0b2ec218f5c';
      const server = nock(config.auth.url).post('/oauth/token').reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: s_OneMonth
      });
      // Act.
      return auth.gettingToken()
        // Assert.
        .then(result => {
          expect(result).to.equal(token);
          expect(server.isDone()).to.be.true;
        });
    });
    it('should return an existing access token if not expired', () => {
      // Arrange.
      auth.clear();
      const token = '141432e6cd4988cf2933f2868450a0b2ec218f5c';
      nock(config.auth.url).post('/oauth/token').reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: s_OneMonth
      });
      return auth.gettingToken()
        // Act.
        .then(() => auth.gettingToken())
        // Assert.
        .then(result => {
          expect(result).to.equal(token);
        });
    });
    it('should return a new access token if existing will soon expire', () => {
      // Arrange.
      auth.clear();
      nock(config.auth.url).post('/oauth/token').reply(200, {
        token_type: 'bearer',
        access_token: '141432e6cd4988cf2933f2868450a0b2ec218f5c',
        expires_in: s_OneHour
      });
      const secondToken = 'cf141432e83f22ec218f5c68450a0b6cd4988293';
      return auth.gettingToken()
        .then(() => {
          nock(config.auth.url).post('/oauth/token').reply(200, {
            token_type: 'bearer',
            access_token: secondToken,
            // One hour.
            expires_in: s_OneMonth
          });
        })
        // Act.
        .then(() => auth.gettingToken())
        // Assert.
        .then(result => {
          expect(result).to.equal(secondToken);
        });
    });
  });
});
