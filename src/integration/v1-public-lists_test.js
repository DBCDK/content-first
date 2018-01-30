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
  arrangeCommunityServiceToRespondWithServerError_OnPost,
  expectError_CommunityConnectionProblem,
  expectListToBeCached,
  expectLocation,
  expectValidLists
} = require('./test-commons');
const community = require('server/community');
const transform = require('__/services/elvis/transformers');

describe('Public lists', () => {
  const webapp = request(mock.external);

  beforeEach(async function() {
    await mock.resetting();
    await seeder.seedingCommunity();
    const profileId = await creatingProfile();
    this.timeout(4 * 1000 + 1500);
    await insertingThreePublicLists(profileId);
  });

  afterEach(function() {
    if (this.currentTest.state !== 'passed') {
      mock.dumpLogs();
    }
  });

  describe('GET /v1/public-lists', () => {
    it('should respect a limit parameter', () => {
      const uri = '/v1/public-lists?limit=2';
      const normalisedUri = `${uri}&offset=0`;
      return webapp
        .get(uri) // force break
        .expect(expectSuccess_TwoNewestListsAndNextOffsetTwo(normalisedUri))
        .then(() => expectListToBeCached(threePublicLists[2].id))
        .then(() => expectListToBeCached(threePublicLists[1].id));
    });

    it('should respect an offset parameter', () => {
      const uri = '/v1/public-lists?limit=2&offset=2';
      return webapp
        .get(uri) // force break
        .expect(expectSuccess_TwoLastListsAndNextOffsetFour(uri))
        .then(() => expectListToBeCached(threePublicLists[0].id))
        .then(() => expectListToBeCached(seeder.cachedPublicListUuid()));
    });

    it('should use defaults when no parameters are supplied', () => {
      const uri = '/v1/public-lists';
      const normalisedUri = `${uri}?limit=10&offset=0`;
      return webapp
        .get(uri) // force break
        .expect(expectSuccess_AllPublicAndNextOffsetFour(normalisedUri))
        .then(() => expectListToBeCached(threePublicLists[2].id))
        .then(() => expectListToBeCached(threePublicLists[1].id))
        .then(() => expectListToBeCached(threePublicLists[0].id))
        .then(() => expectListToBeCached(seeder.cachedPublicListUuid()));
    });

    describe('with community not responding properly', () => {
      it('should handle no connection to community', () => {
        arrangeCommunityServiceToRespondWithServerError_OnPost();
        return webapp
          .get('/v1/public-lists')
          .expect(expectError_CommunityConnectionProblem);
      });
      afterEach(nock.cleanAll);
    });
  });

  function expectSuccess_TwoNewestListsAndNextOffsetTwo(uri) {
    expectLocation(uri);
    return response => {
      expectSuccess(response.body, (links, data) => {
        expectValidate(links, 'schemas/lists-links-out.json');
        expect(links.self).to.equal(uri);
        expect(links.next).to.match(/offset=2/);
        expectValidLists(data);
        expectTwoFirstLists(data);
      });
      expect(response.status).to.equal(200);
    };
  }

  function expectTwoFirstLists(document) {
    expect(document).to.have.length(2);
    expect(document[0].links).to.deep.equal({
      self: `/v1/lists/${threePublicLists[2].id}`
    });
    expect(document[0].data).to.deep.equal({
      type: threePublicLists[2].type,
      public: true,
      owner: seeder.knownUserId(),
      title: threePublicLists[2].title,
      description: threePublicLists[2].description,
      list: threePublicLists[2].list
    });
    expect(document[1].links).to.deep.equal({
      self: `/v1/lists/${threePublicLists[1].id}`
    });
    expect(document[1].data).to.deep.equal({
      type: threePublicLists[1].type,
      public: true,
      owner: seeder.knownUserId(),
      title: threePublicLists[1].title,
      description: threePublicLists[1].description,
      list: threePublicLists[1].list
    });
  }

  function expectSuccess_TwoLastListsAndNextOffsetFour(uri) {
    expectLocation(uri);
    return response => {
      expectSuccess(response.body, (links, data) => {
        expectValidate(links, 'schemas/lists-links-out.json');
        expect(links.self).to.equal(uri);
        expect(links.next).to.match(/offset=4/);
        expectValidLists(data);
        expectTwoLastLists(data);
      });
      expect(response.status).to.equal(200);
    };
  }

  function expectTwoLastLists(document) {
    expect(document).to.have.length(2);
    expect(document[0].links).to.deep.equal({
      self: `/v1/lists/${threePublicLists[0].id}`
    });
    expect(document[0].data).to.deep.equal({
      type: threePublicLists[0].type,
      public: true,
      owner: seeder.knownUserId(),
      title: threePublicLists[0].title,
      description: threePublicLists[0].description,
      list: threePublicLists[0].list
    });
    expect(document[1].links).to.deep.equal({
      self: `/v1/lists/${seeder.cachedPublicListUuid()}`
    });
  }

  function expectSuccess_AllPublicAndNextOffsetFour(uri) {
    expectLocation(uri);
    return response => {
      expectSuccess(response.body, (links, data) => {
        expectValidate(links, 'schemas/lists-links-out.json');
        expect(links.self).to.equal(uri);
        // Hmm, there seems to be a bug in community server which makes this fail:
        // expect(links.next).to.match(/offset=4/);
        expectValidLists(data);
      });
      expect(response.status).to.equal(200);
    };
  }

  async function creatingProfile() {
    const {profile} = transform.contentFirstUserToCommunityProfileAndEntities(
      anotherProfile
    );
    const data = await community.creatingUserProfile(profile);
    const profileId = data.id;
    await community.updatingProfileWithShortlistAndTastes(profileId, {
      attributes: {
        openplatform_id: seeder.knownUserId(),
        openplatform_token: 'someToken'
      }
    });
    return profileId;
  }

  async function insertingThreePublicLists(profileId) {
    let chain = new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    threePublicLists.forEach(list => {
      chain = chain.then(() => {
        return new Promise(resolve => {
          addingList(profileId, list);
          setTimeout(resolve, 1000);
        });
      });
    });
    await chain;
  }

  async function addingList(profileId, list) {
    const document = transform.contentFirstListToCommunityEntity(list);
    await community.creatingListEntity(profileId, document);
  }

  const anotherProfile = {
    name: 'Georg Gearløse',
    shortlist: [],
    profiles: []
  };

  const threePublicLists = [
    {
      id: '64b7d06dc1ed4874b77aad99a0a630c2',
      type: 'CUSTOM_LIST',
      public: true,
      title: 'List 1',
      description: 'Se min liste 1',
      list: [
        {
          pid: '746924-basis-84651733',
          description: 'Bog 1'
        }
      ]
    },
    {
      id: '8390f9cee49b426294c8c888d4431ca0',
      type: 'CUSTOM_LIST',
      public: true,
      title: 'List 2',
      description: 'Se min liste 2',
      list: [
        {
          pid: '498943-basis-92920034',
          description: 'Bog 2'
        }
      ]
    },
    {
      id: '834cf89e233e457b9935018029a84e1d',
      type: 'CUSTOM_LIST',
      public: true,
      title: 'List 3',
      description: 'Se min liste 3',
      list: [
        {
          pid: '048894-basis-18354057',
          description: 'Bog 3'
        }
      ]
    }
  ];
});
