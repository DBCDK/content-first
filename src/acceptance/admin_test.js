/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {external, internal} = require('fixtures/mock-server');
const config = require('server/config');
const {expect} = require('chai');
const request = require('supertest');
const packageJson = require('../../package.json');
describe('Admin API on running database', () => {
  describe('Public endpoint', () => {
    const webapp = request(external);

    describe('/pid', () => {
      it('should return the process id', () => {
        // Act.
        return (
          webapp
            .get('/pid')
            .set('Accept', 'text/plain')
            // Assert.
            .expect(200)
            .expect('Content-Type', /text/)
            .expect(/^[0-9]+$/)
        );
      });
    });

    describe('/howru', () => {
      it('should answer that everything is fine and give additional information', () => {
        // Arrange.
        arrangeSubserviceResponse('AL');
        // Act.
        return (
          webapp
            .get('/howru')
            .set('Accept', 'application/json')
            // Assert.
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
              expectStatusOkAndNoErrors(res.body);
              expectStatusContainsServiceInfo(res.body);
              expectNoSecretsRevealed(res.body);
            })
        );
      });

      it('should detect authenticator problems', () => {
        // Arrange.
        arrangeSubserviceResponse('_LC');
        // Act.
        return (
          webapp
            .get('/howru')
            .set('Accept', 'application/json')
            // Assert.
            .expect('Content-Type', /json/)
            .expect(503)
            .expect(res => {
              expectStatusError(
                /authentication.* communication failed/i,
                res.body
              );
              expectNoSecretsRevealed(res.body);
            })
        );
      });

      it('should detect login problems', () => {
        // Arrange.
        arrangeSubserviceResponse('A_C');
        // Act.
        return (
          webapp
            .get('/howru')
            .set('Accept', 'application/json')
            // Assert.
            .expect('Content-Type', /json/)
            .expect(503)
            .expect(res => {
              expectStatusError(/login.* communication failed/i, res.body);
              expectNoSecretsRevealed(res.body);
            })
        );
      });
    });
  });

  describe('Internal endpoint', () => {
    const hidden = request(internal);

    describe('server crashes', () => {
      it('should be catched', () => {
        // Act.
        return (
          hidden
            .get('/crash')
            // Assert.
            .expect(500)
        );
      });
    });
  });
});

const {expectValidate} = require('fixtures/output-verifiers');

function expectStatusOkAndNoErrors(document) {
  expectValidate(document, 'schemas/status-out.json');
  expect(document.ok).to.be.true;
  expect(document).to.not.have.property('errorText');
  expect(document).to.not.have.property('errorLog');
}

function expectStatusError(errorMatcher, document) {
  expectValidate(document, 'schemas/status-out.json');
  expect(document.ok).to.be.false;
  expect(document).to.have.property('errorText');
  expect(document.errorText).to.match(errorMatcher);
  expect(document).to.have.property('errorLog');
}

function expectStatusContainsServiceInfo(document) {
  // Service info.
  expect(document).to.have.property('address');
  expect(document['api-version']).to.equal('1');
  expect(document).to.have.property('version');
  expect(document.version).to.equal(packageJson.version);
}

function expectNoSecretsRevealed(document) {
  expect(document).to.not.have.nested.property('config.db.connection.user');
  expect(document).to.not.have.nested.property('config.db.connection.password');
  expect(document).to.not.have.nested.property('config.auth.id');
  expect(document).to.not.have.nested.property('config.auth.secret');
  // Safety net, do not leak something that looks like a secret.
  const everything = JSON.stringify(document);
  expect(everything).to.not.match(/password/i);
  expect(everything).to.not.match(/secret/i);
  expect(everything).to.not.match(/salt/i);
}

const authConst = require('__/services/smaug/authentication-constants')();
const loginConst = require('__/services/hejmdal/login-constants')();
const nock = require('nock');

function arrangeSubserviceResponse(authLoginCommunity) {
  const auth = authLoginCommunity[0];
  const login = authLoginCommunity[1];
  if (auth === 'A') {
    nock(config.auth.url)
      .get(authConst.apiHealth)
      .reply(200, authConst.healthyResponse);
  } else {
    nock(config.auth.url)
      .get(authConst.apiHealth)
      .reply(500);
  }
  if (login === 'L') {
    nock(config.login.url)
      .get(loginConst.apiHealth)
      .reply(200, loginConst.healthyResponse);
  } else {
    nock(config.login.url)
      .get(loginConst.apiHealth)
      .reply(500);
  }
  nock(config.recompass.url)
    .get('/status')
    .reply(200, authConst.healthyResponse);
}
