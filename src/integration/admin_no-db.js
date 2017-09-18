/* eslint-env mocha */
'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const expectValidate = require('./output-verifiers').expectValidate;

describe('Admin API', () => {
  describe('No database connection', () => {
    const port = 5640;
    process.env.PORT = port;
    process.env.DB_HOST = 'bd.exists.not';
    const external = require('server').external;
    const webapp = request(external);
    describe('/howru', () => {
      it('should say that database is unreachable', done => {
        webapp.get('/howru')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(res => {
            expectValidate(res.body, 'schemas/status-out.json');
            expect(res.body.ok).to.be.false; // eslint-disable-line no-unused-expressions
            expect(res.body).to.have.property('errorText');
            expect(res.body.errorText).to.match(/unreachable/);
            expect(res.body).to.have.property('errorLog');
          })
          .end(done);
      });
    });
  });
});
