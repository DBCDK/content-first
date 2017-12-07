/* eslint-env mocha */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('Lists', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.beforeEach();
  });
  afterEach(() => {
    mock.afterEach();
  });

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


      it('should retrieve lists', () => {
        // Arrange.
        const loginToken = 'a-valid-login-token-seeded-on-test-start';
        // Act.
        return webapp.get(location)
        .set('cookie', `login-token=${loginToken}`)
        // Assert.
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/lists-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/lists-data-out.json');
            expect(data).to.deep.equal([{
              id: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
              title: 'My List',
              description: 'A brand new list',
              list: [{
                pid: '870970-basis-22629344',
                description: 'Magic to the people'
              }]
            }]);
          });
        })
        .expect(200);
      });
    });

    describe('PUT /v1/lists', () => {

      const newLists = [{
        id: '98c5ff8c6e8f49978c857c23925dbe41',
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

      it('should overwrite profiles', () => {
        // Arrange.
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
            expect(data).to.deep.equal(newLists);
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
                expect(data).to.deep.equal(newLists);
              });
            })
            .expect(200);
        });
      });
    });

  });
});
