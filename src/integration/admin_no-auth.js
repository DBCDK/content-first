/* eslint-env mocha */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const {expectValidate} = require('./output-verifiers');

describe('Admin API', () => {
  describe('No authentication-service connection', () => {
    const {server} = require('./no-auth-server');
    const webapp = request(server);
    describe('/howru', () => {
      it('should say that authentication service is unreachable', done => {
        webapp.get('/howru')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => {
            expectValidate(res.body, 'schemas/status-out.json');
            expect(res.body.ok).to.be.false; // eslint-disable-line no-unused-expressions
            expect(res.body).to.have.property('errorText');
            expect(res.body.errorText).to.match(/authentication service.+unreachable/i);
            expect(res.body).to.have.property('errorLog');
          })
          .end(done);
      });
    });
  });
});
