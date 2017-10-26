/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const constants = require('./login-constants')();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nock = require('nock');
const Login = require('./login-hejmdal');
const {validating} = require('__/json');
const path = require('path');
const schemaUserInfo = path.join(__dirname, 'login-user-info-out.json');

describe('Login connector', () => {

  const config = {
    url: 'https://login.bib.dk'
  };
  const login = new Login(config);

  beforeEach(() => {
    login.clear();
  });

  afterEach(nock.cleanAll);

  describe('with unreachable service', () => {
    it('should say there is no connection', () => {
      // Arrange.
      const token = '98912164d600414686e9c89c02c33db1';
      const id = 1234;
      const slug = `${constants.apiGetTicket}/${token}/${id}`;
      const server = nock(config.url).get(slug).replyWithError(
        'Nope, Hejmdal is sleeping'
      );
      // Act.
      return expect(login.gettingTicket(token, id))
        // Assert.
        .to.be.rejectedWith(Error)
        .then(error => {
          expect(error).to.match(/hejmdal is sleeping/i);
          expect(login.isOk()).to.be.false;
          expect(login.getCurrentError()).to.match(/login-service.+failed/i);
          const log = login.getErrorLog();
          expect(log).to.have.length(1);
          expect(log[0]).to.match(/hejmdal is sleeping/i);
          expect(server.isDone()).to.be.true;
        });
    });
  });

  describe('with responsive service', () => {
    it('should say that everything is ok initially', () => {
      // Assert.
      expect(login.isOk()).to.be.true;
      expect(login.getCurrentError()).to.be.null;
      expect(login.getErrorLog()).to.have.length(0);
    });
    it('should retrieve user info and redirect with cookie', () => {
      // Arrange.
      const token = '4686e9c89c02c33db198912164d60041';
      const id = 1234;
      const slug = `${constants.apiGetTicket}/${token}/${id}`;
      nock(config.url).get(slug).reply(200, {
        id,
        token,
        attributes: {
          cpr: '2508710000',
          gender: 'm',
          userId: '2508710000',
          wayfId: null,
          agencies: [],
          birthDate: '2508',
          birthYear: '1971',
          uniloginId: null,
          municipality: null
        }
      });
      // Act.
      return login.gettingTicket(token, id)
        // Assert.
        .then(validating(schemaUserInfo))
        .then(data => {
          expect(data).to.deep.equal({
            cpr: '2508710000',
            gender: 'm',
            userId: '2508710000',
            wayfId: null,
            agencies: [],
            birthDate: '2508',
            birthYear: 1971,
            uniloginId: null,
            municipality: null
          });
        });
    });
    it('should detect that token/id is rejected and redirect', () => {
      // Arrange.
      const token = '98912164d600414686e9c89c02c33db1';
      const id = 1234;
      const slug = `${constants.apiGetTicket}/${token}/${id}`;
      const server = nock(config.url).get(slug).reply(200, {attributes: null});
      // Act.
      return expect(login.gettingTicket(token, id))
        // Assert.
        .to.be.rejectedWith(Error)
        .then(error => {
          expect(error).to.match(/user information could not be retrieved/i);
          expect(login.isOk()).to.be.true;
          expect(server.isDone()).to.be.true;
        });
    });
    it('testingConnection() should say everything is fine', () => {
      // Arrange.
      const server = nock(config.url).get(constants.apiHealth).reply(200, [
        {name: 'db', state: 'ok'},
        {name: 'borckh', state: 'ok'},
        {name: 'culr', state: 'ok'},
        {name: 'smaug', state: 'ok'},
        {name: 'openAgency', state: 'ok'}
      ]);
      // Act.
      return login.testingConnection()
        .then(ok => {
          expect(ok).to.be.true;
          expect(login.isOk()).to.be.true;
          expect(login.getCurrentError()).to.be.null;
          expect(server.isDone()).to.be.true;
        });
    });
    it('testingConnection() should detect unhealth login service', () => {
      // Arrange.
      const server = nock(config.url).get(constants.apiHealth).reply(500);
      // Act.
      return login.testingConnection()
        .then(ok => {
          expect(ok).to.be.false;
          expect(login.isOk()).to.be.false;
          expect(login.getCurrentError()).to.match(/login-service.+failed/i);
          const log = login.getErrorLog();
          expect(log).to.have.length(1);
          expect(log[0]).to.match(/login service.+unhealthy/i);
          expect(server.isDone()).to.be.true;
        });
    });
  });
});
