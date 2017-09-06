/* eslint-env mocha */
'use strict';

const config = require('server/config');
const expect = require('chai').expect;
const request = require('supertest');
const expectValidate = require('./output-verifiers').expectValidate;

describe('Admin API', () => {
  describe('Running database', () => {
    const webapp = request(`http://localhost:${config.server.port}`);
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
          })
          .end(done);
      });
    });
    describe('default handler should return error', () => {
      it('as JSON', done => {
        const endpoint = '/doesNotExist';
        webapp.get(endpoint)
          .set('Accept', 'application/json')
          .expect(404)
          .expect(res => {
            expect(res.body);
            expect(res.body).to.have.property('errors');
            const errors = res.body.errors;
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error).to.have.property('title');
            expect(error.title).to.equal('Unknown endpoint');
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('resource');
            expect(error.meta.resource).to.equal(endpoint);
          })
          .end(done);
      });
    });
    describe('server crashes', () => {
      it('should be catched', done => {
        webapp.get('/crash')
          .expect(500)
          .end(done);
      });
    });
  });
});
