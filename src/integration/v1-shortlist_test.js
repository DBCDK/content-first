/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const {expect} = require('chai');
const request = require('supertest');
const {
  expectSuccess,
  expectFailure,
  expectValidate
} = require('fixtures/output-verifiers');
const nock = require('nock');
const {
  arrangeCommunityServiceToRespondWithServerError_OnGet,
  arrangeCommunityServiceToRespondWithServerError_OnPut,
  expectError_CommunityConnectionProblem
} = require('./test-commons');

describe('Shortlist', () => {
  const location = '/v1/shortlist';
  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity();
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('GET /v1/shortlist', () => {
    it('should complain about user not logged in when no token', () => {
      // Act.
      return (
        webapp
          .get(location)
          // Assert.
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/user not logged in/i);
              expect(error.detail).to.match(/missing login-token cookie/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('resource');
              expect(error.meta.resource).to.equal(location);
            });
          })
          .expect(403)
      );
    });

    it('should complain about user not logged in when unknown token', () => {
      // Arrange.
      const loginToken = 'token-not-known-to-service';
      // Act.
      return (
        webapp
          .get(location)
          .set('cookie', `login-token=${loginToken}`)
          // Assert.
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/user not logged in/i);
              expect(error.detail).to.match(/unknown login token/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('resource');
              expect(error.meta.resource).to.equal(location);
            });
          })
          .expect(403)
      );
    });

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnGet();
        return webapp
          .get(location)
          .set('cookie', 'login-token=a-valid-login-token')
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should retrieve shortlist', () => {
      // Arrange.
      const loginToken = 'a-valid-login-token';
      // Act.
      return (
        webapp
          .get(location)
          .set('cookie', `login-token=${loginToken}`)
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/shortlist-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/shortlist-data-out.json');
              expect(data).to.deep.equal([
                {
                  pid: '870970-basis-22629344',
                  origin: 'en-god-bog'
                }
              ]);
            });
          })
          .expect(200)
      );
    });
  });

  describe('PUT /v1/shortlist', () => {
    it('should reject wrong content type', () => {
      // Act.
      return (
        webapp
          .put(location)
          .type('text/plain')
          .send('broken')
          // Assert.
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(
                /data.+provided as application\/json/i
              );
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/text\/plain .*not supported/i);
            });
          })
      );
    });

    it('should reject invalid content', () => {
      // Act.
      return (
        webapp
          .put(location)
          .type('application/json')
          .send({foo: 'bar'})
          // Assert.
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed shortlist/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('data is the wrong type');
            });
          })
      );
    });

    const newShortlist = [
      {
        pid: '870970-basis-53188931',
        origin: 'en-let-læst-bog'
      },
      {
        pid: '870970-basis-51752341',
        origin: 'bibliotikarens-ugentlige-anbefaling'
      }
    ];

    it('should complain about user not logged in when no token', () => {
      // Act.
      return (
        webapp
          .put(location)
          .type('application/json')
          .send(newShortlist)
          // Assert.
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/user not logged in/i);
              expect(error.detail).to.match(/missing login-token cookie/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('resource');
              expect(error.meta.resource).to.equal(location);
            });
          })
          .expect(403)
      );
    });

    it('should complain about user not logged in when token has expired', () => {
      // Arrange.
      const loginToken = 'expired-login-token';
      // Act.
      return (
        webapp
          .put(location)
          .set('cookie', `login-token=${loginToken}`)
          .type('application/json')
          .send(newShortlist)
          // Assert.
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/user not logged in/i);
              expect(error.detail).to.match(/login token .+ has expired/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('resource');
              expect(error.meta.resource).to.equal(location);
            });
          })
          .expect(403)
      );
    });

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPut();
        return webapp
          .put(location)
          .set('cookie', 'login-token=a-valid-login-token')
          .type('application/json')
          .send(newShortlist)
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should overwrite shortlist', () => {
      // Arrange.
      const loginToken = 'a-valid-login-token';
      // Act.
      return (
        webapp
          .put(location)
          .set('cookie', `login-token=${loginToken}`)
          .type('application/json')
          .send(newShortlist)
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links).to.have.property('self');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/shortlist-data-out.json');
              expect(data).to.deep.equal(newShortlist);
            });
          })
          .expect(200)
          .then(() => {
            // Act.
            return (
              webapp
                .get(location)
                .set('cookie', `login-token=${loginToken}`)
                // Assert.
                .expect(res => {
                  expectSuccess(res.body, (links, data) => {
                    expectValidate(links, 'schemas/shortlist-links-out.json');
                    expect(links.self).to.equal(location);
                    expectValidate(data, 'schemas/shortlist-data-out.json');
                    expect(data).to.deep.equal(newShortlist);
                  });
                })
                .expect(200)
            );
          })
      );
    });
  });
});
