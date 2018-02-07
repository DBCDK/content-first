/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const seeder = require('./seed-community');
const request = require('supertest');
const nock = require('nock');
const {expect} = require('chai');
const {expectSuccess} = require('fixtures/output-verifiers');
const {expectValidate} = require('fixtures/output-verifiers');
const {
  arrangeCommunityServiceToRespondWithServerError_OnGet,
  arrangeCommunityServiceToRespondWithServerError_OnPost,
  arrangeCommunityServiceToRespondWithServerError_OnPut,
  arrangingEmptyListCache,
  expectError_AccessDeniedOtherUser,
  expectError_AccessDeniedPrivateList,
  expectError_CommunityConnectionProblem,
  expectError_ExpiredLoginToken,
  expectError_ListNotFound,
  expectError_MalformedInput_AdditionalProperties,
  expectError_MissingLoginToken,
  expectError_UnknownLoginToken,
  expectError_WrongContentType,
  expectListToBeCached,
  expectLocation,
  expectSuccess_CachedListSeededOnTestStart,
  expectSuccess_ListsSeededOnTestStart,
  expectSuccess_NewListLocation,
  expectSuccess_UncachedListSeededOnTestStart,
  sleep
} = require('./test-commons');

describe('Lists', () => {
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

  //
  // GET
  //
  describe('GET /v1/lists', () => {
    const location = '/v1/lists';

    it('should complain about user not logged in when no token', () => {
      return webapp // force break
        .get(location)
        .expect(expectError_MissingLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=token-not-known-to-service')
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .get(location)
        .set('cookie', 'login-token=expired-login-token')
        .expect(expectError_ExpiredLoginToken(location));
    });

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPost();
        return webapp
          .get(location)
          .set('cookie', 'login-token=a-valid-login-token')
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should retrieve lists', async () => {
      await sleep(100); // Apparently Elvis needs time get out of bed.
      return webapp
        .get(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_ListsSeededOnTestStart)
        .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
    });
  });

  //
  // POST
  //
  describe('POST /v1/lists', () => {
    const location = '/v1/lists';

    it('should complain about user not logged in when no token', () => {
      return webapp // force break
        .post(location)
        .expect(expectError_MissingLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      return webapp
        .post(location)
        .set('cookie', 'login-token=token-not-known-to-service')
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      return webapp
        .post(location)
        .set('cookie', 'login-token=expired-login-token')
        .expect(expectError_ExpiredLoginToken(location));
    });

    it('should reserve a UUID for the user', () => {
      return webapp
        .post(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_NewListLocation);
    });
  });

  //
  // GET uuid
  //
  describe('GET /v1/lists/:uuid', () => {
    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPost();
        return webapp
          .get('/v1/lists/ffffffffffffffffffffffffffffffff')
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should return Not Found for a list not existing in community', () => {
      const location = '/v1/lists/ffffffffffffffffffffffffffffffff';
      return webapp
        .get(location) // force break
        .expect(expectError_ListNotFound(location));
    });

    it('should return Not Found for a list deleted from community', () => {
      const location = `/v1/lists/${seeder.deletedListUuid()}`;
      return webapp
        .get(location) // force break
        .expect(expectError_ListNotFound(location));
    });

    describe('on public list', () => {
      it('should retrieve cached list existing in community', () => {
        return webapp
          .get(`/v1/lists/${seeder.cachedPublicListUuid()}`)
          .expect(expectSuccess_CachedListSeededOnTestStart);
      });

      it('should retrieve uncached list existing in community', async () => {
        const flushedListUuid = seeder.cachedPublicListUuid();
        await arrangingEmptyListCache();
        return webapp
          .get(`/v1/lists/${flushedListUuid}`)
          .expect(expectSuccess_CachedListSeededOnTestStart)
          .then(() => expectListToBeCached(seeder.cachedPublicListUuid()));
      });

      describe('with community not responding properly', () => {
        it('should handle no connection to community', () => {
          arrangeCommunityServiceToRespondWithServerError_OnGet();
          return webapp
            .get(`/v1/lists/${seeder.cachedPublicListUuid()}`)
            .expect(expectError_CommunityConnectionProblem);
        });
        afterEach(nock.cleanAll);
      });
    });

    describe('on private list', () => {
      it('should complain about user not logged in when no token', () => {
        const url = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
        return webapp
          .get(url) // force break
          .expect(expectError_MissingLoginToken(url))
          .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
      });

      it('should complain about user not logged in when unknown token', () => {
        const url = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
        return webapp
          .get(url)
          .set('cookie', 'login-token=token-not-known-to-service')
          .expect(expectError_UnknownLoginToken(url))
          .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
      });

      it('should complain about user not logged in when token has expired', () => {
        const url = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
        return webapp
          .get(url)
          .set('cookie', 'login-token=expired-login-token')
          .expect(expectError_ExpiredLoginToken(url))
          .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
      });

      it('should retrieve list owned by the user existing in community', () => {
        const url = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
        return webapp
          .get(url)
          .set('cookie', 'login-token=a-valid-login-token')
          .expect(expectSuccess_UncachedListSeededOnTestStart)
          .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
      });

      it('should restrict access to other users private lists', () => {
        const location = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
        return webapp
          .get(location)
          .set('cookie', 'login-token=another-valid-login-token')
          .expect(expectError_AccessDeniedPrivateList(location))
          .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
      });

      describe('with community not responding properly', () => {
        it('should handle no connection to community', () => {
          arrangeCommunityServiceToRespondWithServerError_OnPost();
          return webapp
            .get(`/v1/lists/${seeder.uncachedPrivateListUuid()}`)
            .expect(expectError_CommunityConnectionProblem);
        });
        afterEach(nock.cleanAll);
      });
    });
  });

  //
  // PUT
  //
  describe('PUT /v1/lists/:uuid', () => {
    it('should reject wrong content type', () => {
      const location = `/v1/lists/${seeder.cachedPublicListUuid()}`;
      return webapp
        .put(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .type('text/plain')
        .send('broken')
        .expect(expectError_WrongContentType);
    });

    it('should reject invalid content', () => {
      const location = `/v1/lists/${seeder.cachedPublicListUuid()}`;
      return webapp
        .put(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .type('application/json')
        .send({foo: 'bar'})
        .expect(expectError_MalformedInput_AdditionalProperties);
    });

    const newList = {
      title: 'Brand New List',
      description: 'A too long\ndescription with several\nlines',
      public: false,
      type: 'WEIRD_INTERNAL_TYPE',
      list: [{pid: '12345-abc-6789', description: 'A long pony tail'}]
    };

    it('should complain about user not logged in when no token', () => {
      const location = `/v1/lists/${seeder.cachedPublicListUuid()}`;
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .expect(expectError_MissingLoginToken(location));
    });

    it('should complain about user not logged in when unknown token', () => {
      const location = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=token-not-known-to-service')
        .expect(expectError_UnknownLoginToken(location));
    });

    it('should complain about user not logged in when token has expired', () => {
      const location = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=expired-login-token')
        .expect(expectError_ExpiredLoginToken(location));
    });

    it('should complain when the list belongs to another user', () => {
      const location = `/v1/lists/${seeder.cachedPublicListUuid()}`;
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=another-valid-login-token')
        .expect(expectError_AccessDeniedOtherUser(location));
    });

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPut();
        const location = `/v1/lists/${seeder.cachedPublicListUuid()}`;
        return webapp
          .put(location)
          .type('application/json')
          .send(newList)
          .set('cookie', 'login-token=a-valid-login-token')
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should complain when list does not exist in cache', () => {
      const location = '/v1/lists/EA9427D4-76D5-4CD0-8713-D9A929998159';
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectError_ListNotFound(location));
    });

    it('should create new list', () => {
      const location = `/v1/lists/${seeder.reservedListUuid()}`;
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_NewList(location))
        .then(() => expectListToBeCached(seeder.reservedListUuid()));
    });

    it('should update cached list existing in community', () => {
      const location = `/v1/lists/${seeder.cachedPublicListUuid()}`;
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_NewList(location));
    });

    it('should revive a list deleted from community', async () => {
      const location = `/v1/lists/${seeder.cachedPublicListUuid()}`;
      await arrangingListToBeDeleted(location);
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_NewList(location));
    });

    it('should accept update on reserved list', async () => {
      const location = await arrangingReserveNewList();
      return webapp
        .put(location)
        .type('application/json')
        .send(newList)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectSuccess_NewList(location));
    });

    function arrangingReserveNewList() {
      return webapp
        .post('/v1/lists')
        .set('cookie', 'login-token=a-valid-login-token')
        .then(response => {
          return response.body.links.self;
        });
    }

    function expectSuccess_NewList(uri) {
      expectLocation(uri);
      return response => {
        expectSuccess(response.body, (links, data) => {
          expectValidate(links, 'schemas/list-links-out.json');
          expect(links.self).to.equal(uri);
          const listWithOwner = Object.assign(
            {owner: seeder.knownUserId()},
            newList
          );
          expect(data).to.deep.include(listWithOwner);
        });
        expect(response.status).to.equal(200);
      };
    }
  });

  //
  // DELETE
  //
  describe('DELETE /v1/lists/:uuid', () => {
    it('should complain about user not logged in when no token', () => {
      const nonExistingList = '/v1/lists/ffffffffffffffffffffffffffffffff';
      return webapp // force break
        .delete(nonExistingList)
        .expect(expectError_MissingLoginToken(nonExistingList));
    });

    it('should complain about user not logged in when unknown token', () => {
      const nonExistingList = '/v1/lists/ffffffffffffffffffffffffffffffff';
      return webapp
        .delete(nonExistingList)
        .set('cookie', 'login-token=token-not-known-to-service')
        .expect(expectError_UnknownLoginToken(nonExistingList));
    });

    it('should complain about user not logged in when token has expired', () => {
      const nonExistingList = '/v1/lists/ffffffffffffffffffffffffffffffff';
      return webapp
        .delete(nonExistingList)
        .set('cookie', 'login-token=expired-login-token')
        .expect(expectError_ExpiredLoginToken(nonExistingList));
    });

    describe('with community not responding properly', () => {
      it('should handle no connection getting from community', () => {
        const nonExistingList = '/v1/lists/ffffffffffffffffffffffffffffffff';
        arrangeCommunityServiceToRespondWithServerError_OnPost();
        return webapp
          .delete(nonExistingList)
          .set('cookie', 'login-token=a-valid-login-token')
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });

    it('should return Not Found for a list not existing in community', () => {
      const location = '/v1/lists/ffffffffffffffffffffffffffffffff';
      return webapp
        .delete(location)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(expectError_ListNotFound(location));
    });

    it('should complain when the list belongs to another user', () => {
      const location = `/v1/lists/${seeder.uncachedPrivateListUuid()}`;
      return webapp
        .delete(location)
        .set('cookie', 'login-token=another-valid-login-token')
        .expect(expectError_AccessDeniedPrivateList(location))
        .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
    });

    it('should delete cached list existing in community', () => {
      return webapp
        .delete(`/v1/lists/${seeder.cachedPublicListUuid()}`)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(200);
    });

    it('should delete uncached list existing in community', () => {
      return webapp
        .delete(`/v1/lists/${seeder.uncachedPrivateListUuid()}`)
        .set('cookie', 'login-token=a-valid-login-token')
        .expect(200)
        .then(() => expectListToBeCached(seeder.uncachedPrivateListUuid()));
    });
  });

  //
  // HELPERS
  //
  function arrangingListToBeDeleted(uri) {
    return webapp.delete(uri);
  }
});
