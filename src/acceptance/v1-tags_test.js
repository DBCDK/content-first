/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectFailure, expectValidate} = require('fixtures/output-verifiers');
const mock = require('fixtures/mock-server');

describe('Endpoint /v1/tags', () => {

  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
  });

  afterEach(function () {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('Public endpoint', () => {

    describe('GET /v1/tags/:pid', () => {
      it('should return existing tags for a specific PID', () => {
        const pid = 'already-tags-seeded-pid-without-book-entry';
        const location = `/v1/tags/${pid}`;
        return webapp.get(location)
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
          .expect(200);
      });
    });
  });

  describe('Internal endpoint', () => {
    const hidden = request(mock.internal);

    describe('PUT /v1/tags', () => {

      it('should reject wrong content type', () => {
        const contentType = 'text/plain';
        return hidden.put('/v1/tags')
          .type(contentType)
          .send('broken')
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/provided as application\/json/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/text\/plain .*not supported/i);
            });
          })
          .expect(400);
      });

      it('should discard broken input and maintain current tags', () => {
        return hidden.put('/v1/tags')
          .type('application/json')
          .send('{"id": "1234"}')
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed tags data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
            });
          })
          .expect(400)
          .then(() => {
            return webapp.get('/v1/tags/already-tags-seeded-pid-without-book-entry')
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expect(data.tags).to.include(44);
                });
              })
              .expect(200);
          });
      });

      it('should discard partly-broken input and maintain current tags', () => {
        const broken = require('fixtures/partly-broken-tags-array.json');
        return hidden.put('/v1/tags')
          .type('application/json')
          .send(broken)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed tags data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('field pid is required');
              expect(problems).to.deep.include('field selected is the wrong type');
            });
          })
          .expect(400)
          .then(() => {
            return webapp.get('/v1/tags/already-tags-seeded-pid-without-book-entry')
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expect(data.tags).to.include(44);
                });
              })
              .expect(200);
          });
      });

      it('should accept valid input and replace all tags', () => {
        const tags = require('fixtures/good-tags-array.json');
        return hidden.put('/v1/tags')
          .type('application/json')
          .send(tags)
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/tags-array-links-out.json');
              expect(links.self).to.equal('/v1/tags');
              expectValidate(data, 'schemas/tags-array-data-out.json');
              expect(data).to.match(/75 tags for 2 pids created/i);
            });
          })
          .expect(200)
          .then(() => {
            const pid = 'pid-1-for-tag-inserted-by-put';
            const url = `/v1/tags/${pid}`;
            return webapp.get(url)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/tags-links-out.json');
                  expect(links.self).to.equal(url);
                  expectValidate(data, 'schemas/tags-data-out.json');
                  expect(data.pid).to.equal(pid);
                  expect(data.tags).to.be.an('array');
                });
              })
              .expect(200);
          })
          .then(() => {
            const pid = 'already-tags-seeded-pid-without-book-entry';
            const url = `/v1/tags/${pid}`;
            return webapp.get(url)
              .expect(res => {
                expectSuccess(res.body, (links, data) => {
                  expectValidate(links, 'schemas/tags-links-out.json');
                  expect(links.self).to.equal(url);
                  expectValidate(data, 'schemas/tags-data-out.json');
                  expect(data.pid).to.equal(pid);
                  expect(data.tags).to.have.length(0);
                });
              })
              .expect(200);
          });
      });
    });

    describe('PUT /v1/tags/:pid', () => {

      it('should reject wrong content type', () => {
        const contentType = 'text/plain';
        return hidden.put('/v1/tags/1234-example:98765')
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
          });
      });

      it('should reject bad input', () => {
        const broken = require('fixtures/broken-tag-entry.json');
        return hidden.put('/v1/tags/1234-example:98765')
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
          .expect(400);
      });

      it('should reject address that does not agree with PID', () => {
        const martin = require('fixtures/martin-den-herreloese-ridder-tags.json');
        const pid = martin.pid;
        const wrongPid = '12335-wrong:9782637';
        const location = `/v1/tags/${wrongPid}`;
        const contentType = 'application/json';
        return hidden.put(location)
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
          });
      });

      it('should create tags for new PID', () => {
        const tags = require('fixtures/tag-entry.json');
        const pid = tags.pid;
        const location = `/v1/tags/${pid}`;
        return hidden.put(location)
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
          .expect(200);
      });

      it('should overwrite tags for existing PID', () => {
        const pid = require('fixtures/carter-mordoffer-tags').pid;
        const location = `/v1/tags/${pid}`;
        return hidden.put(location)
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
          .expect(200);
      });
    });

    describe('POST /v1/tags', () => {

      it('should reject wrong content type', () => {
        const contentType = 'text/plain';
        return hidden.post('/v1/tags')
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
          });
      });

      it('should reject bad input', () => {
        const broken = require('fixtures/broken-tag-entry.json');
        return hidden.post('/v1/tags')
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
          .expect(400);
      });

      it('should create tags for new PID', () => {
        const tags = require('fixtures/tag-entry.json');
        const pid = tags.pid;
        const location = `/v1/tags/${pid}`;
        return hidden.post('/v1/tags')
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
          .expect(201);
      });

      it('should update tags for existing PID', () => {
        const tags = require('fixtures/carter-mordoffer-tags');
        const pid = tags.pid;
        const location = `/v1/tags/${tags.pid}`;
        return hidden.post('/v1/tags')
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
          .expect(201);
      });
    });

    describe('DELETE /v1/tags/:pid', () => {

      it('should clear all tags for a specific PID', () => {
        const pid = 'already-tags-seeded-pid-without-book-entry';
        const location = `/v1/tags/${pid}`;
        return hidden.del(location)
          .expect(204)
          .then(() => {
            return webapp.get(location)
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
              .expect(200);
          });
      });
    });
  });
});
