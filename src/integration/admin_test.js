/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {external, internal} = require('./mock-server');
const config = require('server/config');
const constants = require('__/service/authentication-constants')();
const {expect} = require('chai');
const request = require('supertest');
const nock = require('nock');
const {expectValidate} = require('./output-verifiers');

describe('Admin API on running database', () => {
  describe('Public endpoint', () => {
    const webapp = request(external);
    describe('/pid', () => {
      it('should return the process id', () => {
        // Act.
        return webapp.get('/pid')
          .set('Accept', 'text/plain')
          // Assert.
          .expect(200)
          .expect('Content-Type', /text/)
          .expect(/^[0-9]+$/);
      });
    });
    describe('/howru', () => {
      it('should answer that everything is fine and give additional information', () => {
        // Arrange.
        nock(config.auth.url).get(constants.apiHealth).reply(200, constants.healthyResponse);
        // Act.
        return webapp.get('/howru')
          .set('Accept', 'application/json')
          // Assert.
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(res => {
            expectValidate(res.body, 'schemas/status-out.json');
            // Remote connections status.
            expect(res.body.ok).to.be.true;
            expect(res.body).to.not.have.property('errorText');
            expect(res.body).to.not.have.property('errorLog');
            // Service info.
            expect(res.body).to.have.property('address');
            expect(res.body['api-version']).to.equal('1');
            expect(res.body).to.have.property('version');
            expect(res.body.version).to.equal('0.2.0');
            expect(res.body).to.not.have.nested.property('config.db.connection.user');
            expect(res.body).to.not.have.nested.property('config.db.connection.password');
            expect(res.body).to.not.have.nested.property('config.auth.id');
            expect(res.body).to.not.have.nested.property('config.auth.secret');
            // Safety net, do not leak something that looks like a secret.
            const everything = JSON.stringify(res.body);
            expect(everything).to.not.match(/password/i);
            expect(everything).to.not.match(/secret/i);
            expect(everything).to.not.match(/salt/i);
          });
      });
    });
  });
  describe('Internal endpoint', () => {
    const hidden = request(internal);
    describe('server crashes', () => {
      it('should be catched', () => {
        // Act.
        return hidden.get('/crash')
          // Assert.
          .expect(500);
      });
    });
  });
});
