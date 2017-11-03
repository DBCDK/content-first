'use strict';

const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('Endpoint /v1/tags', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.beforeEach();
  });
  afterEach(() => {
    mock.afterEach();
  });

  describe('Public endpoint', () => {

    describe('GET /v1/tags/:pid', () => {
      it('should return existing tags for a specific PID', done => {
        const pid = '870970-basis:52947804';
        const location = `/v1/tags/${pid}`;
        webapp.get(location)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data.pid).to.equal(pid);
              expect(data.tags).to.have.members([
                44, 46, 49, 84, 85, 89, 90, 91, 92, 94, 96, 98, 99, 100, 103,
                221, 222, 223, 224, 229, 234, 241, 251, 255, 256, 271, 281,
                302, 318, 332
              ]);
            });
          })
          .expect(200)
          .end(done);
      });
    });
  });

  describe('Internal endpoint', () => {
    const hidden = request(mock.internal);

    describe('PUT /v1/tags/:pid', () => {
      it('should reject wrong content type', done => {
        const contentType = 'text/plain';
        hidden.put('/v1/tags/1234-example:98765')
          .type(contentType)
          .send('broken')
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/provided as application\/json/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/text\/plain .*not supported/i);
            });
          })
          .end(done);
      });

      it('should reject bad input', done => {
        const broken = require('fixtures/broken-tag-entry.json');
        hidden.put('/v1/tags/1234-example:98765')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/malformed tags data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('field pid is the wrong type');
              expect(problems).to.deep.include('field selected is required');
            });
          })
          .expect(400)
          .end(done);
      });

      it('should reject address that does not agree with PID', done => {
        const martin = require('fixtures/martin-den-herreloese-ridder-tags.json');
        const pid = martin.pid;
        const wrongPid = '12335-wrong:9782637';
        const location = `/v1/tags/${wrongPid}`;
        const contentType = 'application/json';
        hidden.put(location)
          .type(contentType)
          .send(martin)
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/mismatch beetween pid and location/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.equal(`Expected PID ${wrongPid} but found ${pid}`);
            });
          })
          .end(done);
      });

      it('should create tags for new PID', done => {
        const tags = require('fixtures/tag-entry.json');
        const pid = tags.pid;
        const location = `/v1/tags/${pid}`;
        hidden.put(location)
          .type('application/json')
          .send(tags)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data.pid).to.equal(pid);
              expect(data.tags).to.have.members([
                49, 55, 56, 90, 221, 223, 224, 230, 234, 281, 302, 313
              ]);
            });
          })
          .expect('location', location)
          .expect(200)
          .end(done);
      });

      it('should overwrite tags for existing PID', done => {
        const pid = require('fixtures/carter-mordoffer-tags').pid;
        const location = `/v1/tags/${pid}`;
        hidden.put(location)
          .type('application/json')
          .send({pid, selected: ['1', '2']})
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data).to.deep.equal({
                pid,
                tags: [1, 2]
              });
            });
          })
          .expect(200)
          .end(done);
      });
    });

    describe('POST /v1/tags', () => {

      it('should reject wrong content type', done => {
        const contentType = 'text/plain';
        hidden.post('/v1/tags')
          .type(contentType)
          .send('broken')
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/provided as application\/json/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/text\/plain .*not supported/i);
            });
          })
          .end(done);
      });

      it('should reject bad input', done => {
        const broken = require('fixtures/broken-tag-entry.json');
        hidden.post('/v1/tags')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error).to.have.property('title');
              expect(error.title).to.match(/malformed tags data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('field pid is the wrong type');
              expect(problems).to.deep.include('field selected is required');
            });
          })
          .expect(400)
          .end(done);
      });

      it('should create tags for new PID', done => {
        const tags = require('fixtures/tag-entry.json');
        const pid = tags.pid;
        const location = `/v1/tags/${pid}`;
        hidden.post('/v1/tags')
          .type('application/json')
          .send(tags)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data.pid).to.equal(pid);
              expect(data.tags).to.have.members([
                49, 55, 56, 90, 221, 223, 224, 230, 234, 281, 302, 313
              ]);
            });
          })
          .expect('location', location)
          .expect(201)
          .end(done);
      });

      it('should update tags for existing PID', done => {
        const tags = require('fixtures/carter-mordoffer-tags');
        const pid = tags.pid;
        const location = `/v1/tags/${tags.pid}`;
        hidden.post('/v1/tags')
          .type('application/json')
          .send({pid, selected: ['1', '2']})
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/tags-data-out.json');
              expect(data.pid).to.equal(pid);
              expect(data.tags).to.have.members([
                1, 2, 44, 46, 49, 84, 85, 89, 90, 91, 92, 94, 96, 98, 99, 100,
                103, 221, 222, 223, 224, 229, 234, 241, 251, 255, 256, 271,
                281, 302, 318, 332
              ]);
            });
          })
          .expect('location', location)
          .expect(201)
          .end(done);
      });
    });

    describe('DELETE /v1/tags/:pid', () => {

      it('should clear all tags for a specific PID', done => {
        const pid = '870970-basis:52947804';
        const location = `/v1/tags/${pid}`;
        hidden.del(location)
          .expect(204)
          .then(() => {
            webapp.get(location)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/tags-links-out.json');
                  expect(links.self).to.equal(location);
                  expectValidate(data, 'schemas/tags-data-out.json');
                  expect(data).to.deep.equal({
                    pid,
                    tags: []
                  });
                });
              })
              .expect(200)
              .end(done);
          })
          .catch(done);
      });
    });
  });
});
