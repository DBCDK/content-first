/* eslint-env mocha */
'use strict';

const {expect} = require('chai');
const request = require('supertest');
const {expectSuccess, expectFailure, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('User data', () => {
  const webapp = request(mock.external);
  beforeEach(async () => {
    await mock.beforeEach();
  });
  afterEach(() => {
    mock.afterEach();
  });

  describe('Public endpoint', () => {
    const location = '/v1/user';

    describe('GET /v1/user', () => {
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
        const loginToken = 'nofuture-nono-nono-nono-nofuture4you';
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

      it('should complain about user not logged in when token has expired', () => {
        // Arrange.
        const loginToken = 'expired-login-token-seeded-on-test-start';
        // Act.
        return webapp.get(location)
          .set('cookie', `login-token=${loginToken}`)
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

      it('should retrieve user data when logged in', () => {
        // Arrange.
        const loginToken = 'a-valid-login-token-seeded-on-test-start';
        // Act.
        return webapp.get(location)
          .set('cookie', `login-token=${loginToken}`)
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expectValidate(links, 'schemas/user-links-out.json');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/user-data-out.json');
              expectValidate(data.shortlist, 'schemas/shortlist-data-out.json');
              expectValidate(data.lists, 'schemas/lists-data-out.json');
              expectValidate(data.profiles, 'schemas/profiles-data-out.json');
              expect(data).to.deep.equal({
                name: 'Jens Godfredsen',
                lists: [{
                  id: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
                  type: 'SYSTEM_LIST',
                  title: 'My List',
                  description: 'A brand new list',
                  list: [{
                    pid: '870970-basis-22629344',
                    description: 'Magic to the people'
                  }]
                }],
                shortlist: [{
                  pid: '870970-basis-22629344',
                  origin: 'en-god-bog'
                }],
                profiles: [{
                  name: 'Med på den værste',
                  profile: {
                    moods: ['Åbent fortolkningsrum', 'frygtelig', 'fantasifuld'],
                    genres: ['Brevromaner', 'Noveller'],
                    authors: ['Hanne Vibeke Holst', 'Anne Lise Marstrand Jørgensen'],
                    archetypes: ['hestepigen']
                  }
                }]
              });
            });
          })
          .expect(200);
      });
    });

    describe('PUT /v1/user', () => {

      const newUserInfo = {
        name: 'Ole Henriksen',
        shortlist: [{
          pid: 'already-seeded-pid-blendstrup-havelaagebogen',
          origin: 'en-let-læst-bog'
        }, {
          pid: 'already-seeded-pid-martin-ridder',
          origin: 'bibliotikarens-ugentlige-anbefaling'
        }],
        lists: [{
          id: '98c5ff8c6e8f49978c857c23925dbe41',
          type: 'SYSTEM_LIST',
          title: 'Must read',
          description: 'Interesting books',
          list: [{
            pid: '870970-basis-51752341',
            description: 'Exciting!'
          }]
        }],
        profiles: [{
          name: 'En tynd en',
          profile: {
            moods: ['frygtelig'],
            authors: ['Carsten Jensen'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
          }
        }, {
          name: 'Ny profile',
          profile: {
            moods: ['dramatisk'],
            authors: ['Helge Sander'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
          }
        }]
      };

      it('should complain about user not logged in when no token', () => {
        // Act.
        return webapp.put(location)
          .type('application/json')
          .send(newUserInfo)
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
        const loginToken = 'nofuture-nono-nono-nono-nofuture4you';
        // Act.
        return webapp.put(location)
          .set('cookie', `login-token=${loginToken}`)
          .type('application/json')
          .send(newUserInfo)
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

      it('should complain about user not logged in when token has expired', () => {
        // Arrange.
        const loginToken = 'expired-login-token-seeded-on-test-start';
        // Act.
        return webapp.put(location)
          .set('cookie', `login-token=${loginToken}`)
          .type('application/json')
          .send(newUserInfo)
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
              expect(error.title).to.match(/malformed user data/i);
              expect(error).to.have.property('detail');
              expect(error.detail).to.match(/does not adhere to schema/i);
              expect(error).to.have.property('meta');
              expect(error.meta).to.have.property('problems');
              const problems = error.meta.problems;
              expect(problems).to.be.an('array');
              expect(problems).to.deep.include('data has additional properties');
            });
          });
      });

      it('should update valid content for logged-in user', () => {
        // Arrange.
        const loginToken = 'a-valid-login-token-seeded-on-test-start';
        // Act.
        return webapp.put('/v1/user').send(newUserInfo)
          .type('application/json')
          .set('cookie', `login-token=${loginToken}`)
          // Assert.
          .expect(res => {
            expectSuccess(res.body, (links, data) => {
              expect(links).to.have.property('self');
              expect(links.self).to.equal(location);
              expectValidate(data, 'schemas/user-data-out.json');
              expectValidate(data.shortlist, 'schemas/shortlist-data-out.json');
              expectValidate(data.lists, 'schemas/lists-data-out.json');
              expectValidate(data.profiles, 'schemas/profiles-data-out.json');
              expect(data).to.deep.equal(newUserInfo);
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
                  expectValidate(links, 'schemas/user-links-out.json');
                  expect(links.self).to.equal(location);
                  expectValidate(data, 'schemas/user-data-out.json');
                  expectValidate(data.shortlist, 'schemas/shortlist-data-out.json');
                  expectValidate(data.lists, 'schemas/lists-data-out.json');
                  expectValidate(data.profiles, 'schemas/profiles-data-out.json');
                  expect(data).to.deep.equal(newUserInfo);
                });
              })
              .expect(200);
          });
      });
    });
  });
});
