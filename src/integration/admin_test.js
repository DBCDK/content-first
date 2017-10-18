/* eslint-env mocha */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const {expectValidate} = require('./output-verifiers');

describe('Admin API on running database', () => {
  const {external, internal} = require('./mock-server');
  describe('Public endpoint', () => {
    const webapp = request(external);
    describe('/pid', () => {
      it('should return the process id', done => {
        webapp.get('/pid')
          .set('Accept', 'text/plain')
          .expect(200)
          .expect('Content-Type', /text/)
          .expect(/^[0-9]+$/)
          .end(done);
      });
    });
    describe('/howru', () => {
      it('should answer that everything is fine and give additional information', done => {
        webapp.get('/howru')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(res => {
            expectValidate(res.body, 'schemas/status-out.json');
            expect(res.body).to.have.property('address');
            expect(res.body['api-version']).to.equal('1');
            expect(res.body).to.have.property('version');
            expect(res.body.version).to.equal('0.1.0');
            expect(res.body).to.not.have.nested.property('config.db.connection.user');
            expect(res.body).to.not.have.nested.property('config.db.connection.password');
          })
          .end(done);
      });
    });
  });
  describe('Internal endpoint', () => {
    const hidden = request(internal);
    describe('server crashes', () => {
      it('should be catched', done => {
        hidden.get('/crash')
          .expect(500)
          .end(done);
      });
    });
  });
});
