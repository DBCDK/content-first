/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const {expect} = require('chai');
const request = require('supertest');
const nock = require('nock');
const {expectSuccess, expectFailure, expectValidate} = require('fixtures/output-verifiers');
const _ = require('lodash');

describe('Lists', () => {

  const webapp = request(mock.external);

  beforeEach(async () => {
    await mock.resetting();
    await seeder.seedingCommunity('0101781234');
  });

  afterEach(function () {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  describe('Endpoint /v1/lists', () => {
    const location = '/v1/lists';

    describe('GET /v1/lists', () => {

      it('should complain about user not logged in when no token', () => {
        // Act.
        return webapp.get(location)
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
        .expect(403);
      });

      it('should complain about user not logged in when unknown token', () => {
        // Arrange.
        const loginToken = 'token-not-known-to-service';
        // Act.
        return webapp.get(location)
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
        .expect(403);
      });

      describe('with community not responding properly', () => {
        beforeEach(() => {
          arrangeCommunityServiceToRespondToPostWithServerError();
        });
        it('should handle no connection to community', () => {
          return actingAsLoggedInUserGetLists()
          .expect(expectCommunityServiceConnectionProblem);
        });
        afterEach(() => {
          nock.cleanAll();
        });
      });

      it('should retrieve lists', async () => {
        // Arrange.
        const loginToken = 'a-valid-login-token-seeded-on-test-start';
        await sleep(100); // Apparently Elvis needs time get out of bed.
        // Act.
        return webapp.get(location)
        .set('cookie', `login-token=${loginToken}`)
        // Assert.
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/lists-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/lists-data-out.json');
            expect(data).to.deep.include({
              id: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
              type: 'SYSTEM_LIST',
              public: false,
              title: 'My List',
              description: 'A brand new list',
              list: [{
                pid: '870970-basis-22629344',
                description: 'Magic to the people'
              }]
            });
            expect(data).to.deep.include({
              id: 'fa4f3a3de3a34a188234ed298ecbe810',
              type: 'CUSTOM_LIST',
              public: false,
              title: 'Gamle Perler',
              description: 'Bøger man simpelthen må læse',
              list: [{
                pid: '870970-basis-47573974',
                description: 'Russisk forvekslingskomedie'
              }]
            });
          });
        })
        .expect(200);
      });
    });

    describe('PUT /v1/lists', () => {

      const newLists = [{
        id: '98c5ff8c6e8f49978c857c23925dbe41',
        type: 'SYSTEM_LIST',
        title: 'Must read',
        description: 'Interesting books',
        list: [{
          pid: '870970-basis-51752341',
          description: 'Exciting!'
        }]
      }];

      it('should reject wrong content type', () => {
        // Act.
        return webapp.put(location)
          .type('text/plain')
          .send('broken')
          // Assert.
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/user data.+provided as application\/json/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/text\/plain .*not supported/i);
            });
          });
      });

      it('should reject invalid content', () => {
        // Act.
        return webapp.put(location)
          .type('application/json')
          .send({foo: 'bar'})
          // Assert.
          .expect(400)
          .expect(res => {
            expectFailure(res.body, errors => {
              expect(errors).to.have.length(1);
              const error = errors[0];
              expect(error.title).to.match(/malformed lists/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/do not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('data is the wrong type');
            });
          });
      });

      it('should complain about user not logged in when no token', () => {
        // Act.
        return webapp.put(location)
        .type('application/json')
        .send(newLists)
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
        .expect(403);
      });

      it('should complain about user not logged in when token has expired', () => {
        // Arrange.
        const loginToken = 'expired-login-token-seeded-on-test-start';
        // Act.
        return webapp.put(location)
        .set('cookie', `login-token=${loginToken}`)
        .type('application/json')
        .send(newLists)
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
        .expect(403);
      });

      describe('with community not responding properly', () => {
        beforeEach(() => {
          arrangeCommunityServiceToRespondToPostWithServerError();
        });
        it('should handle no connection to community', () => {
          return actingAsLoggedInUserUpdateValidLists(newLists)
          .expect(expectCommunityServiceConnectionProblem);
        });
        afterEach(() => {
          nock.cleanAll();
        });
      });

      it('should overwrite lists', () => {
        // Arrange.
        const expectedOutput = _.clone(newLists);
        Object.assign(expectedOutput[0], {public: false});
        const loginToken = 'a-valid-login-token-seeded-on-test-start';
        // Act.
        return webapp.put(location)
        .set('cookie', `login-token=${loginToken}`)
        .type('application/json')
        .send(newLists)
        // Assert.
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expect(links).to.have.property('self');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/lists-data-out.json');
            expect(data).to.deep.equal(expectedOutput);
          });
        })
        .expect(200)
        .then(() => {
          // Act.
          return webapp.get(location)
            .set('cookie', `login-token=${loginToken}`)
            // Assert.
            .expect(res => {
              expectSuccess(res.body, (links, data) => {
                expectValidate(links, 'schemas/lists-links-out.json');
                expect(links.self).to.equal(location);
                expectValidate(data, 'schemas/lists-data-out.json');
                expect(data).to.deep.equal(expectedOutput);
              });
            })
            .expect(200);
        });
      });

    });

    //
    // Helpers.
    //

    function arrangeCommunityServiceToRespondToPostWithServerError () {
      const config = require('server/config').community;
      nock(config.url).post(() => true).reply(500);
    }

    function actingAsLoggedInUserUpdateValidLists (newLists) {
      const loginToken = 'a-valid-login-token-seeded-on-test-start';
      return webapp.put(location)
      .set('cookie', `login-token=${loginToken}`)
      .type('application/json')
      .send(newLists);
    }

    function actingAsLoggedInUserGetLists () {
      const loginToken = 'a-valid-login-token-seeded-on-test-start';
      return webapp.get(location)
      .set('cookie', `login-token=${loginToken}`);
    }

    function expectCommunityServiceConnectionProblem (response) {
      expectFailure(response.body, errors => {
        expect(errors).to.have.length(1);
        const error = errors[0];
        expect(error.title).to.match(/community-service.+connection problem/i);
        expect(error.detail).to.match(/community service.+not reponding/i);
      });
      expect(response.status).to.equal(503);
    }

  });
});
