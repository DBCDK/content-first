/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const config = require('server/config');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nock = require('nock');
// const {expectValidate, expectFailure} = require('./output-verifiers');
const Authenticator = require('./authentication-smaug');

const s_OneHour = 60 * 60;
const s_OneMonth = 30 * 24 * 60 * 60;

describe.only('Authentication connector', () => {

  const auth = new Authenticator();
  beforeEach(() => {
    auth.clear();
  });

  afterEach(nock.cleanAll);

  describe('with unreachable service', () => {
    it('should return an existing access token if not expired', () => {
      // Arrange.
      const token = '141432e6cd4988cf2933f2868450a0b2ec218f5c';
      nock(config.auth.url).post('/oauth/token').reply(200, {
        token_type: 'bearer',
        access_token: token,
        expires_in: s_OneMonth
      });
      let server;
      return auth.gettingToken()
        .then(() => {
          server = nock(config.auth.url).post('/oauth/token').replyWithError(
            'Nope, Smaug is down'
          );
          // Act.
          return auth.gettingToken();
        })
        .then(result => {
          // Assert.
          expect(result).to.equal(token);
          expect(server.isDone()).to.be.false;
        });
    });
    it('should say there is no connection if new token is needed', () => {
      // Arrange.
      const server = nock(config.auth.url).post('/oauth/token').replyWithError(
        'Nope, Smaug is down'
      );
      // Act.
      return expect(auth.gettingToken())
        .to.be.rejectedWith(Error)
        .then(error => {
          expect(error).to.match(/smaug is down/i);
          expect(auth.isOk()).to.be.false;
          expect(auth.getCurrentError()).to.match(/authentication-service.+failed/i);
          const log = auth.getErrorLog();
          expect(log).to.have.length(1);
          expect(log[0]).to.match(/smaug is down/i);
          expect(server.isDone()).to.be.true;
        });
    });
  });

  describe('with responsive service', () => {
    it('should say that everything is ok', () => {
      // Assert.
      expect(auth.isOk()).to.be.true;
    });
    it('should complain about wrong answer from authenticator', () => {
      // Arrange.
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
          expect(error).to.have.property('title');
          expect(error.title).to.match(/does not adhere to JSON schema/i);
          expect(auth.isOk()).to.be.false;
          expect(auth.getCurrentError()).to.match(/authentication-service.+failed/i);
          const log = auth.getErrorLog();
          expect(log).to.have.length(1);
          expect(log[0]).to.match(/not adhere to.+schema/i);
          expect(server.isDone()).to.be.true;
        });
    });
    it('should retrieve a new token when needed', () => {
      // Arrange.
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
          expect(auth.isOk()).to.be.true;
          expect(auth.getCurrentError()).to.be.null;
          expect(server.isDone()).to.be.true;
        });
    });
    it('should return an existing access token if not expired', () => {
      // Arrange.
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
          expect(auth.isOk()).to.be.true;
          expect(auth.getCurrentError()).to.be.null;
        });
    });
    it('should return a new access token if existing will soon expire', () => {
      // Arrange.
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
            expires_in: s_OneMonth
          });
        })
        // Act.
        .then(() => auth.gettingToken())
        // Assert.
        .then(result => {
          expect(result).to.equal(secondToken);
          expect(auth.isOk()).to.be.true;
          expect(auth.getCurrentError()).to.be.null;
        });
    });
  });
});
