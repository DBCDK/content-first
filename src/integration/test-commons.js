/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

module.exports = {
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
  expectError_UserDoesNotExist,
  expectError_WrongContentType,
  expectListsSeededOnTestStart,
  expectListToBeCached,
  expectLocation,
  expectSuccess_CachedListSeededOnTestStart,
  expectSuccess_ListsSeededOnTestStart,
  expectSuccess_NewListLocation,
  expectSuccess_PublicViewOfUserSeededOnTestStart,
  expectSuccess_UncachedListSeededOnTestStart,
  expectSuccess_UserData,
  expectSuccess_UserHasRoles,
  expectSuccess_UserSeededOnTestStart,
  expectValidLists,
  sleep
};

const {expect} = require('chai');
const nock = require('nock');
const seeder = require('./seed-community');
const {expectSuccess} = require('fixtures/output-verifiers');
const {expectFailure} = require('fixtures/output-verifiers');
const {expectValidate} = require('fixtures/output-verifiers');
const config = require('server/config');
const constants = require('server/constants')();
const knex = require('knex')(config.db);
const listTable = constants.lists.table;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function arrangeCommunityServiceToRespondWithServerError_OnPost() {
  nock(config.community.url)
    .post(() => true)
    .reply(500);
}

function arrangeCommunityServiceToRespondWithServerError_OnPut() {
  nock(config.community.url)
    .put(() => true)
    .reply(500);
}

function arrangeCommunityServiceToRespondWithServerError_OnGet() {
  nock(config.community.url)
    .get(() => true)
    .reply(500);
}

function expectError_MissingLoginToken(uri) {
  expectLocation(uri);
  return response => {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/user not logged in/i);
      expect(error.detail).to.match(/missing login-token cookie/i);
      expect(error).to.have.property('meta');
      expect(error.meta).to.have.property('resource');
      expect(error.meta.resource).to.equal(uri);
    });
    expect(response.status).to.equal(403);
  };
}

function expectError_UserDoesNotExist(response) {
  expectFailure(response.body, errors => {
    expect(errors).to.have.length(1);
    const error = errors[0];
    expect(error.title).to.match(/user not found/i);
    // expect(error.detail).to.match(/no user with openplatform id/i);
    expect(error.detail).to.match(/user.+does not exist or is deleted/i);
  });
  expect(response.status).to.equal(404);
}

function expectSuccess_UserHasRoles(roles) {
  expect(roles).to.be.an('array');
  return response => {
    expectSuccess(response.body, (links, data) => {
      expectValidate(links, 'schemas/public-user-links-out.json');
      expectValidate(data, 'schemas/public-user-data-out.json');
      expect(data.roles).to.deep.equal(roles);
    });
    expect(response.status).to.equal(200);
  };
}

function expectError_UnknownLoginToken(uri) {
  expectLocation(uri);
  return response => {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/user not logged in/i);
      expect(error.detail).to.match(/unknown login token/i);
      expect(error).to.have.property('meta');
      expect(error.meta).to.have.property('resource');
      expect(error.meta.resource).to.equal(uri);
    });
    expect(response.status).to.equal(403);
  };
}

function expectError_ExpiredLoginToken(uri) {
  expectLocation(uri);
  return response => {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/user not logged in/i);
      expect(error.detail).to.match(/token.+expired/i);
      expect(error).to.have.property('meta');
      expect(error.meta).to.have.property('resource');
      expect(error.meta.resource).to.equal(uri);
    });
    expect(response.status).to.equal(403);
  };
}

function expectError_WrongContentType(response) {
  expectFailure(response.body, errors => {
    expect(errors).to.have.length(1);
    const error = errors[0];
    expect(error.title).to.match(/user data.+provided as application\/json/i);
    expect(error).to.have.property('detail');
    expect(error.detail).to.match(/text\/plain .*not supported/i);
  });
  expect(response.status).to.equal(400);
}

function expectSuccess_ListsSeededOnTestStart(response) {
  expectSuccess(response.body, (links, data) => {
    expectValidate(links, 'schemas/lists-links-out.json');
    expect(links.self).to.equal('/v1/lists');
    expectValidLists(data);
    expectListsSeededOnTestStart(data);
  });
  expect(response.status).to.equal(200);
}

function expectValidLists(document) {
  expectValidate(document, 'schemas/lists-data-out.json');
  document.forEach(entry => {
    expectValidate(entry.links, 'schemas/list-links-out.json');
    expectValidate(entry.data, 'schemas/list-data-out.json');
  });
}

function expectSuccess_CachedListSeededOnTestStart(response) {
  expectSuccess(response.body, (links, data) => {
    expectValidate(links, 'schemas/list-links-out.json');
    expect(links.self).to.equal(`/v1/lists/${seeder.cachedPublicListUuid()}`);
    expectValidate(data, 'schemas/list-data-out.json');
    expectCachedListSeededOnTestStart(data);
  });
  expect(response.status).to.equal(200);
}

function expectSuccess_UncachedListSeededOnTestStart(response) {
  expectSuccess(response.body, (links, data) => {
    expectValidate(links, 'schemas/list-links-out.json');
    expect(links.self).to.equal(
      `/v1/lists/${seeder.uncachedPrivateListUuid()}`
    );
    expectValidate(data, 'schemas/list-data-out.json');
    expectUncachedListSeededOnTestStart(data);
  });
  expect(response.status).to.equal(200);
}

function expectSuccess_UserSeededOnTestStart(response) {
  expectSuccess(response.body, (links, data) => {
    expectValidate(links, 'schemas/user-links-out.json');
    expect(links.self).to.equal('/v1/user');
    expectValidate(data, 'schemas/user-data-out.json');
    expectValidate(data.shortlist, 'schemas/shortlist-data-out.json');
    expectValidLists(data.lists);
    expectValidate(data.profiles, 'schemas/profiles-data-out.json');
    expect(data.name).to.deep.equal('Jens Godfredsen');
    expectShortlistSeededOnTestStart(data.shortlist);
    expectProfilesSeededOnTestStart(data.profiles);
    expectListsSeededOnTestStart(data.lists);
  });
  expect(response.status).to.equal(200);
}

function expectSuccess_PublicViewOfUserSeededOnTestStart(response) {
  expectSuccess(response.body, (links, data) => {
    expectValidate(links, 'schemas/public-user-links-out.json');
    expect(links.self).to.equal(
      `/v1/user/${encodeURIComponent(seeder.knownUserId())}`
    );
    expectValidate(data, 'schemas/public-user-data-out.json');
    expectValidLists(data.lists);
    expect(data.name).to.deep.equal('Jens Godfredsen');
    expectPublicListsSeededOnTestStart(data.lists);
  });
  expect(response.status).to.equal(200);
}

function expectShortlistSeededOnTestStart(document) {
  expect(document).to.deep.equal([
    {
      pid: '870970-basis-22629344',
      origin: 'en-god-bog'
    }
  ]);
}

function expectProfilesSeededOnTestStart(document) {
  expect(document).to.deep.equal([
    {
      name: 'Med på den værste',
      profile: {
        moods: ['Åbent fortolkningsrum', 'frygtelig', 'fantasifuld'],
        genres: ['Brevromaner', 'Noveller'],
        authors: ['Hanne Vibeke Holst', 'Anne Lise Marstrand Jørgensen'],
        archetypes: ['hestepigen']
      }
    }
  ]);
}

function expectListsSeededOnTestStart(document) {
  expect(document).to.deep.include(cachedListSeededOnTestStart());
  expect(document).to.deep.include({
    data: {
      type: 'CUSTOM_LIST',
      public: false,
      owner: seeder.knownUserId(),
      title: 'Gamle Perler',
      description: 'Bøger man simpelthen må læse',
      list: [
        {
          pid: '870970-basis-47573974',
          description: 'Russisk forvekslingskomedie'
        }
      ]
    },
    links: {self: `/v1/lists/${seeder.uncachedPrivateListUuid()}`}
  });
  expect(document).to.have.length(2);
}

function expectPublicListsSeededOnTestStart(document) {
  expect(document).to.deep.include(cachedListSeededOnTestStart());
  expect(document).to.have.length(1, 'Private list included');
}

function expectCachedListSeededOnTestStart(document) {
  expect(document).to.deep.equal(cachedListSeededOnTestStart().data);
}

function expectUncachedListSeededOnTestStart(document) {
  expect(document).to.deep.equal(uncachedListSeededOnTestStart().data);
}

function cachedListSeededOnTestStart() {
  return {
    data: {
      type: 'SYSTEM_LIST',
      public: true,
      owner: seeder.knownUserId(),
      title: 'My List',
      description: 'A brand new list',
      list: [
        {
          pid: '870970-basis-22629344',
          description: 'Magic to the people'
        }
      ]
    },
    links: {self: `/v1/lists/${seeder.cachedPublicListUuid()}`}
  };
}

function uncachedListSeededOnTestStart() {
  return {
    data: {
      type: 'CUSTOM_LIST',
      public: false,
      owner: seeder.knownUserId(),
      title: 'Gamle Perler',
      description: 'Bøger man simpelthen må læse',
      list: [
        {
          pid: '870970-basis-47573974',
          description: 'Russisk forvekslingskomedie'
        }
      ]
    },
    links: {self: `/v1/lists/${seeder.uncachedPrivateListUuid()}`}
  };
}

function arrangingEmptyListCache() {
  return knex.raw(`truncate table ${listTable}`);
}

async function expectListToBeCached(uuid) {
  const rows = await knex(listTable)
    .where('uuid', uuid)
    .select();
  expect(rows).to.have.length(1, 'List not found in cache');
  const row = rows[0];
  expect(row.community_profile_id).to.not.be.null;
  expect(row.community_entity_id).to.not.be.null;
}

function expectSuccess_NewListLocation(response) {
  expectSuccess(response.body, (links, data) => {
    expectValidate(links, 'schemas/list-links-out.json');
    expect(links.self).to.match(/\/v1\/lists\/[0-9a-f]/);
    expect(data).to.equal(links.self);
  });
  expect(response.status).to.equal(201);
}

function expectSuccess_UserData(uri, partialUserData) {
  expectLocation(uri);
  return response => {
    expectSuccess(response.body, (links, data) => {
      expectValidate(links, 'schemas/user-links-out.json');
      expect(links.self).to.equal(uri);
      expectValidate(data, 'schemas/user-data-out.json');
      expectValidate(data.shortlist, 'schemas/shortlist-data-out.json');
      expectValidLists(data.lists);
      expectValidate(data.profiles, 'schemas/profiles-data-out.json');
      expect(data.name).to.deep.equal(partialUserData.name);
      expect(data.shortlist).to.deep.equal(partialUserData.shortlist);
      expect(data.profiles).to.deep.equal(partialUserData.profiles);
    });
    expect(response.status).to.equal(200);
  };
}

function expectError_CommunityConnectionProblem(response) {
  // console.log(response.body.errors[0].response);
  expectFailure(response.body, errors => {
    expect(errors).to.have.length(1);
    const error = errors[0];
    expect(error.title).to.match(/community-service.+connection problem/i);
    expect(error.detail).to.match(/community service.+not reponding/i);
  });
  expect(response.status).to.equal(503);
}

function expectError_MalformedInput_AdditionalProperties(response) {
  expectFailure(response.body, errors => {
    expect(errors).to.have.length(1);
    const error = errors[0];
    expect(error.title).to.match(/malformed.+data/i);
    expect(error).to.have.property('detail');
    expect(error.detail).to.match(/does not adhere to schema/i);
    expect(error).to.have.property('meta');
    expect(error.meta).to.have.property('problems');
    const problems = error.meta.problems;
    expect(problems).to.be.an('array');
    expect(problems).to.deep.include('data has additional properties');
  });
  expect(response.status).to.equal(400);
}

function expectError_ListNotFound(uri) {
  expectLocation(uri);
  return response => {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/not found/i);
      expect(error).to.have.property('meta');
      expect(error.meta).to.have.property('resource');
      expect(error.meta.resource).to.equal(uri);
    });
    expect(response.status).to.equal(404);
  };
}

function expectError_AccessDeniedPrivateList(uri) {
  expectLocation(uri);
  return response => {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/access denied/i);
      expect(error.detail).to.match(/private list/i);
      expect(error).to.have.property('meta');
      expect(error.meta).to.have.property('resource');
      expect(error.meta.resource).to.equal(uri);
    });
    expect(response.status).to.equal(403);
  };
}

function expectError_AccessDeniedOtherUser(uri) {
  expectLocation(uri);
  return response => {
    expectFailure(response.body, errors => {
      expect(errors).to.have.length(1);
      const error = errors[0];
      expect(error.title).to.match(/access denied/i);
      expect(error.detail).to.match(/belong.+other user/i);
      expect(error).to.have.property('meta');
      expect(error.meta).to.have.property('resource');
      expect(error.meta.resource).to.equal(uri);
    });
    expect(response.status).to.equal(403);
  };
}

function expectLocation(uri) {
  expect(uri).to.be.a('string', 'Not a URI');
  expect(uri).to.match(/^\/v1\/(lists|user|public-lists)/i, 'Not a URI');
}
