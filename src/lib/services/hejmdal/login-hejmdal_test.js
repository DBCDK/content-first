/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const constants = require('./login-constants')();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
const nock = require('nock');
const Login = require('./login-hejmdal');
const {validatingInput} = require('__/json');
const path = require('path');
const schemaUserInfo = path.join(__dirname, 'login-user-info-out.json');

describe('Login connector', () => {
  const logger = {
    log: {
      debug: sinon.stub(),
      info: sinon.stub(),
      error: sinon.stub()
    }
  };

  const config = {
    url: 'https://login.bib.dk',
    openplatformUrl: 'https://openplatform.dbc.dk',
    salt: 'mysecret'
  };

  const login = new Login(config, logger);

  beforeEach(() => {
    login.clear();
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      const _ = require('lodash');
      const logs = _.map(logger.log.debug.getCalls(), call => call.args);
      const util = require('util');
      console.log(util.inspect(logs, {depth: null})); // eslint-disable-line no-console
    }
    logger.log.debug.reset();
    nock.cleanAll();
  });

  it('should say that everything is ok initially', () => {
    // Assert.
    expect(login.isOk()).to.be.true;
    expect(login.getCurrentError()).to.be.null;
    expect(login.getErrorLog()).to.have.length(0);
  });

  it('should retrieve user info as JSON and return hashed IDs', () => {
    const openplatformToken = 'someToken';
    const openplatformId = 'YaYu9Sg6MlduZVnCkhv4N0wnt8g7Oa+f';
    const token = '4686e9c89c02c33db198912164d60041';
    const id = 1234;
    arrangeOpenplatformToReturnId(openplatformToken, openplatformId);
    arrangeHejmdalToReturn({token, id, openplatformToken});
    return login
      .gettingTicket(token, id)
      .then(expectOpenplatformIdAndToken(openplatformId, openplatformToken));
  });

  it('should reject user info without openplatform token', () => {
    const token = '4686e9c89c02c33db198912164d60041';
    const id = 1234;
    arrangeHejmdalToReturn({token, id});
    return expect(login.gettingTicket(token, id))
      .to.be.rejectedWith(Error)
      .then(expectMockedServerToBeDone)
      .then(expectConnectorOkAndNoErrors);
  });

  it('should retrieve user info as text and redirect with cookie', () => {
    const openplatformToken = 'someToken';
    const openplatformId = 'YaYu9Sg6MlduZVnCkhv4N0wnt8g7Oa+f';
    const token = '4686e9c89c02c33db198912164d60041';
    const id = 1234;
    arrangeOpenplatformToReturnId(openplatformToken, openplatformId);
    arrangeHejmdalToReturn({token, id, openplatformToken});
    // TODO: does 'redirect with cookie' actually get tested?
    return login
      .gettingTicket(token, id)
      .then(expectOpenplatformIdAndToken(openplatformId, openplatformToken));
  });

  it('should detect that token/id is rejected and redirect', () => {
    // Arrange.
    const token = '98912164d600414686e9c89c02c33db1';
    const id = 1234;
    const slug = `${constants.apiGetTicket}/${token}/${id}`;
    const server = nock(config.url)
      .get(slug)
      .reply(200, {attributes: null});
    // Act.
    return (
      expect(login.gettingTicket(token, id))
        // Assert.
        .to.be.rejectedWith(Error)
        .then(error => {
          expect(error).to.match(/no login information received/i);
          expect(login.isOk()).to.be.true;
          expect(server.isDone()).to.be.true;
        })
        .then(expectMockedServerToBeDone)
        .then(expectConnectorOkAndNoErrors)
    );
  });

  it('testingConnection() should say everything is fine', () => {
    // Arrange.
    const server = nock(config.url)
      .get(constants.apiHealth)
      .reply(200, [
        {name: 'db', state: 'ok'},
        {name: 'borckh', state: 'ok'},
        {name: 'culr', state: 'ok'},
        {name: 'smaug', state: 'ok'},
        {name: 'openAgency', state: 'ok'}
      ]);
    // Act.
    return login.testingConnection().then(ok => {
      expect(ok).to.be.true;
      expect(login.isOk()).to.be.true;
      expect(login.getCurrentError()).to.be.null;
      expect(server.isDone()).to.be.true;
    });
  });

  it('testingConnection() should detect unhealth login service', () => {
    // Arrange.
    const server = nock(config.url)
      .get(constants.apiHealth)
      .reply(500);
    // Act.
    return login.testingConnection().then(ok => {
      expect(ok).to.be.false;
      expect(login.isOk()).to.be.false;
      expect(login.getCurrentError()).to.match(/login-service.+failed/i);
      const log = login.getErrorLog();
      expect(log).to.have.length(1);
      expect(log[0]).to.match(/login service.+unhealthy/i);
      expect(server.isDone()).to.be.true;
    });
  });

  it('should detect no connection to hejmdal', () => {
    // Arrange.
    const token = '98912164d600414686e9c89c02c33db1';
    const id = 1234;
    const slug = `${constants.apiGetTicket}/${token}/${id}`;
    const server = nock(config.url)
      .get(slug)
      .replyWithError('Nope, Hejmdal is sleeping');
    // Act.
    return (
      expect(login.gettingTicket(token, id))
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
        })
    );
  });

  it('should detect no connection to openplatform', () => {
    const token = '98912164d600414686e9c89c02c33db1';
    const id = 1234;
    const openplatformToken = 'someToken';
    arrangeHejmdalToReturn({id, token, openplatformToken});
    arrangeOpenplatformToFail(openplatformToken);
    return expect(login.gettingTicket(token, id))
      .to.be.rejectedWith(Error)
      .then(expectErrorOpenplatformProblem);
  });

  function arrangeOpenplatformToFail(token) {
    nock(config.openplatformUrl)
      .get(constants.apiGetUserIdByToken(token))
      .replyWithError('Openplatform has sunk');
  }

  function expectErrorOpenplatformProblem(error) {
    expect(error).to.match(/openplatform has sunk/i);
    expect(login.isOk()).to.be.false;
    expect(login.getCurrentError()).to.match(/login-service.+failed/i);
    const log = login.getErrorLog();
    expect(log).to.have.length(1);
    expect(log[0]).to.match(/openplatform has sunk/i);
    expectMockedServerToBeDone();
  }

  function arrangeOpenplatformToReturnId(token, openplatformId) {
    nock(config.openplatformUrl)
      .get(constants.apiGetUserIdByToken(token))
      .reply(200, {
        statusCode: 200,
        data: {
          id: openplatformId,
          name: 'BIBLO testlåner',
          address: 'Roskilde Bibliotek',
          postalCode: '0000',
          loans: [],
          orders: [],
          debt: [],
          ddbcmsapi: 'https://cmscontent.dbc.dk/'
        }
      });
  }

  function arrangeHejmdalToReturn(options) {
    const {id, token, openplatformToken} = options;
    const slug = `${constants.apiGetTicket}/${token}/${id}`;
    nock(config.url)
      .get(slug)
      .reply(200, {
        id,
        token,
        attributes: {
          authenticatedToken: openplatformToken,
          cpr: '1701840000',
          userId: '1701840000',
          wayfId: null,
          uniloginId: 'some-unilogin-id',
          agencies: [
            {
              userId: '1701840000',
              agencyId: '715100',
              userIdType: 'CPR'
            }
          ]
        }
      });
  }

  function expectOpenplatformIdAndToken(openplatformId, openplatformToken) {
    expect(typeof openplatformId).to.equal('string');
    expect(typeof openplatformToken).to.equal('string');
    return async document => {
      await validatingInput(document, schemaUserInfo);
      expect(document).to.deep.equal({openplatformId, openplatformToken});
      expectMockedServerToBeDone();
      expectConnectorOkAndNoErrors();
    };
  }

  function expectMockedServerToBeDone() {
    expect(nock.isDone()).to.be.true;
  }

  function expectConnectorOkAndNoErrors() {
    expect(login.isOk()).to.be.true;
    expect(login.getCurrentError()).to.be.null;
    expect(login.getErrorLog()).to.have.length(0);
  }
});
