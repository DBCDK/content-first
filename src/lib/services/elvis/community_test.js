/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undefined */
'use strict';

const constants = require('./community-constants')();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nock = require('nock');
const sinon = require('sinon');
const Community = require('./community');
const transform = require('./transformers');

describe('Community connector', () => {
  const logger = {
    log: {
      debug: sinon.stub(),
      info: sinon.stub(),
      error: sinon.stub()
    }
  };

  const config = {
    url: 'http://localhost:3210',
    name: 'Læsekompasset'
  };

  const sut = new Community(config, logger);

  beforeEach(() => {
    sut.clear();
  });

  let mockedSubservice;

  afterEach(nock.cleanAll);

  describe('gettingCommunityId', () => {
    it('should detect no connection', () => {
      arrangeCommunityToRespondItIsDead();
      return expect(sut.gettingCommunityId())
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should say that everything is ok initially', () => {
      expectCommunityOkAndNoErrors();
    });

    it('should get existing community id', () => {
      arrangeExistingCommunityWithId(2);
      return sut.gettingCommunityId().then(expectCommunityIdToHaveId_2);
    });

    it('should only ask subservice once for existing community id', () => {
      arrangeExistingCommunityWithId(2);
      return sut
        .gettingCommunityId()
        .then(() => {
          return sut.gettingCommunityId();
        })
        .then(expectCommunityIdToHaveId_2);
    });

    it('should create a community when none exists', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(1);
      return sut.gettingCommunityId().then(expectCommunityIdToHaveId_1);
    });

    it('should remember community id after creation', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(2);
      return sut.gettingCommunityId().then(expectCommunityIdToHaveId_2);
    });

    it('should only ask subservice once for the community', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(2);
      return sut
        .gettingCommunityId()
        .then(() => {
          return sut.gettingCommunityId();
        })
        .then(expectCommunityIdToHaveId_2);
    });
  });

  describe('updatingProfileWithShortlistAndTastes', () => {
    const input = {
      name: 'Jens Godfredsen',
      attributes: {
        shortlist: [
          {pid: '870970-basis-53188931', origin: 'en-let-læst-bog'},
          {
            pid: '870970-basis-51752341',
            origin: 'bibliotikarens-ugentlige-anbefaling'
          }
        ],
        tastes: [
          {
            name: 'En tynd en',
            moods: ['frygtelig'],
            authors: ['Carsten Jensen'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
          },
          {
            name: 'Ny profile',
            moods: ['dramatisk'],
            authors: ['Helge Sander'],
            genres: ['Skæbnefortællinger', 'Horror'],
            archetypes: ['Goth']
          }
        ]
      }
    };

    it('should detect no connnection', () => {
      arrangePutProfileToRespondItIsDead();
      return expect(sut.updatingProfileWithShortlistAndTastes(123, input))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should handle user disappeared', () => {
      arrangeNonexistingUserForUpdate();
      return expect(sut.updatingProfileWithShortlistAndTastes(123, input))
        .to.be.rejectedWith(Error)
        .then(expectNotFound);
    });

    it('should accept shortlist & tastes update and handle success', () => {
      const profileId = 123;
      arrangeGetProfileReturnsUserWithIdAndNoOtherData(profileId);
      return sut.updatingProfileWithShortlistAndTastes(profileId, input);
    });

    it('should accept external ID update and handle success', () => {
      const profileId = 123;
      arrangeGetProfileReturnsUserWithIdAndNoOtherData(profileId);
      return sut.updatingProfileWithShortlistAndTastes(profileId, {
        attributes: {
          openplatform_id: 'an-existing-user-seeded-on-test-start'
        }
      });
    });
  });

  describe('gettingIdsOfAllListEntitiesOwnedByUserWithProfileId', () => {
    it('should detect no connnection', () => {
      arrangeCommunityQueryToRespondItIsDead();
      return expect(
        sut.gettingIdsOfAllListEntitiesOwnedByUserWithProfileId(123)
      )
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should handle success', () => {
      arrangeQueryReponseWithListOfEntityUuidAndIds();
      return sut
        .gettingIdsOfAllListEntitiesOwnedByUserWithProfileId(33)
        .then(expectEntryListWithUuidAndIds);
    });
  });

  describe('creatingUserProfile', () => {
    it('should reject malformed input', () => {
      return expect(sut.creatingUserProfile({name: 123})) // force break
        .to.be.rejected.then(expectMalformedProfile);
    });

    const userInfo = require('./fixtures/frontend-user-info-out.json');
    const {profile} = transform.contentFirstUserToCommunityProfileAndEntities(
      userInfo
    );

    it('should detect no connection', () => {
      arrangePostProfileToRespondItIsDead();
      return expect(sut.creatingUserProfile(profile))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should handle creation of profile with shortlist & tastes', () => {
      arrangePostProfileReturnsUserWithIdAndNoOtherData();
      return sut.creatingUserProfile(profile);
    });
  });

  describe('creatingListEntity', () => {
    it('should reject malformed input', () => {
      return expect(sut.creatingListEntity(123, {name: 123}))
        .to.be.rejected // force break
        .then(expectMalformedList);
    });

    const userInfo = require('./fixtures/frontend-user-info-out.json');
    const {lists} = transform.contentFirstUserToCommunityProfileAndEntities(
      userInfo
    );

    it('should detect no connection', () => {
      arrangePostEntityToRespondItIsDead();
      const input = lists[0];
      return expect(sut.creatingListEntity(123, input))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should handle creation of list', () => {
      const profileId = 123;
      arrangePostEntityReturnsTrivialEntity();
      const input = lists[0];
      return sut
        .creatingListEntity(profileId, input)
        .then(expectListWithExtraInfo);
    });
  });

  describe('updatingListEntity', () => {
    it('should reject malformed input', () => {
      return expect(
        sut.updatingListEntity(1, 2, {name: 123})
      ).to.be.rejected.then(expectMalformedUpdateList);
    });

    const userInfo = require('./fixtures/frontend-user-info-out.json');
    const {lists} = transform.contentFirstUserToCommunityProfileAndEntities(
      userInfo
    );

    it('should detect no connection', () => {
      const entityId = 5432;
      arrangePutEntityToRespondItIsDead(entityId);
      const input = lists[0];
      return expect(sut.updatingListEntity(123, entityId, input))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should handle non-existing list', () => {
      const entityId = 5432;
      arrangePutEntityToRespondNotFound(entityId);
      const input = lists[0];
      return expect(sut.updatingListEntity(123, entityId, input))
        .to.be.rejectedWith(Error)
        .then(expectNotFound);
    });

    it('should handle creation of list', () => {
      const entityId = 5432;
      arrangePutEntityToReturnTrivialEntity(entityId);
      const input = lists[0];
      return sut.updatingListEntity(123, entityId, input);
    });
  });

  describe('deletingListEntity', () => {
    it('should detect no connection', () => {
      const entityId = 5432;
      arrangePutEntityToRespondItIsDead(entityId);
      return expect(sut.deletingListEntity(123, entityId))
        .to.be.rejected // force break
        .then(expectCommunityIsDead);
    });

    it('should complain about non-existing entry', () => {
      const entityId = 5432;
      arrangePutEntityToRespondNotBelongToCommunity(entityId);
      return expect(sut.deletingListEntity(123, entityId))
        .to.be.rejected // force break
        .then(expectEntityNotFound);
    });

    it('should delete an existing entity', () => {
      const profileId = 124;
      const entityId = 5433;
      arrangeListEntityToBeDeleted(profileId, entityId);
      return sut.deletingListEntity(profileId, entityId);
    });
  });

  describe('gettingUserByProfileId', () => {
    it('should detect no connection', () => {
      arrangeGetProfileToRespondItIsDead();
      return expect(sut.gettingUserByProfileId(123))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should reject when user not found', () => {
      const profileId = 123;
      arrangeGetProfileToReturnNotFound(profileId);
      return expect(sut.gettingUserByProfileId(profileId)).to.be.rejected.then(
        expectProfileNotFound
      );
    });

    it('should return all user data on success', () => {
      const profileId = 123;
      arrangeGetProfileToReturnAllUserData(profileId);
      return sut
        .gettingUserByProfileId(profileId)
        .then(expectUserDataToBeFullyPopulated);
    });
  });

  describe('gettingAllListEntitiesOwnedByProfileId', () => {
    it('should detect no connection', () => {
      arrangeCommunityQueryToRespondItIsDead();
      return expect(sut.gettingAllListEntitiesOwnedByProfileId(123))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should return all user-owned list-entities on success', () => {
      arrangeQueryToReturnListOfEntities();
      return sut
        .gettingAllListEntitiesOwnedByProfileId(123)
        .then(expectUserDataToHoldAllEntities);
    });
  });

  describe('gettingListByEntityId', () => {
    it('should detect no connection', () => {
      const entityId = 1234;
      arrangeGetEntityToRespondItIsDead(entityId);
      return expect(sut.gettingListByEntityId(entityId))
        .to.be.rejected // force break
        .then(expectCommunityIsDead);
    });

    it('should return an existing list', () => {
      const entityId = 1234;
      const profileId = 123;
      arrangeGetEntityToRespondWithPrivateEntity(profileId, entityId);
      return sut // force break
        .gettingListByEntityId(entityId)
        .then(expectResponseToHoldList(profileId, entityId));
    });

    it('should handle non-existing list', () => {
      const entityId = 1234;
      arrangeGetEntityToRespondNotFound(entityId);
      return expect(sut.gettingListByEntityId(entityId))
        .to.be.rejected // force break
        .then(expectError_ListNotFound);
    });
  });

  describe('gettingListEntityByUuid', () => {
    const uuid = '5fd81fcd17ca4b01a66dfe47a5f6efac';

    it('should detect no connection', () => {
      arrangeCommunityQueryToRespondItIsDead();
      return expect(sut.gettingListEntityByUuid(uuid))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should return an existing list', () => {
      arrangeQueryToReturnList(uuid);
      return sut // force break
        .gettingListEntityByUuid(uuid)
        .then(expectResponseToHoldList);
    });

    it('should handle non-existing list', () => {
      arrangeQueryToReturnListNotFound();
      return expect(sut.gettingListEntityByUuid(uuid))
        .to.be.rejected // force break
        .then(expectError_ListNotFound);
    });
  });

  describe('gettingProfileIdByOpenplatformId', () => {
    it('should detect no connection', () => {
      arrangeCommunityQueryToRespondItIsDead();
      return expect(sut.gettingProfileIdByOpenplatformId('some-hash'))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should handle non-existing userId', () => {
      arrangeCommunityQueryToRespondUserIdNotFound();
      return expect(sut.gettingProfileIdByOpenplatformId('some-hash'))
        .to.be.rejected // force break
        .then(expectError_UserIdNotFound);
    });

    it('should return profile id for existing userId', () => {
      arrangeCommunityQueryToRespondWithFoundProfileId();
      return sut
        .gettingProfileIdByOpenplatformId('some-hash')
        .then(expectProfileId);
    });
  });

  describe('gettingPublicLists', () => {
    it('should detect no connection', () => {
      arrangeCommunityQueryToRespondItIsDead();
      return expect(sut.gettingPublicLists(10, 10))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should return empty list on out-of-bounds offset', () => {
      arrangeCommunityQueryToReturnNoMoreLists();
      return sut
        .gettingPublicLists(10, 10) // force break
        .then(expectEmptyListOfLists);
    });

    it('should return all public lists', () => {
      arrangeCommunityToReturnTwoOutOfFourPublicLists();
      return sut
        .gettingPublicLists(2) // force break
        .then(expectTwoOutOfFourPublicLists);
    });
  });

  //
  // Helpers.
  //

  function arrangeCommunityToRespondItIsDead() {
    const endpoint = `${constants.apiCommunity}/${config.name}`;
    mockedSubservice = nock(config.url)
      .get(endpoint)
      .replyWithError('Nope, community GET is dead');
  }

  function expectCommunityIsDead(document) {
    const matcher = /.+is dead/i;
    expect(document).to.match(matcher);
    expect(sut.isOk()).to.be.false;
    expect(sut.getCurrentError()).to.match(/community.+communication failed/i);
    const log = sut.getErrorLog();
    expect(log).to.have.length(1);
    expect(log[0]).to.match(matcher);
    expect(mockedSubservice.isDone()).to.be.true;
  }

  function arrangeExistingCommunityWithId(id) {
    const slug = `${constants.apiCommunity}/${config.name}`;
    mockedSubservice = nock(config.url)
      .get(slug)
      .reply(200, {
        data: {
          id,
          name: config.name,
          attributes: {},
          created_epoch: 1512554933,
          deleted_epoch: null
        }
      });
  }

  function arrangeCommunityToNotExistButBeCreatedWithId(id) {
    nock(config.url)
      .get(`${constants.apiCommunity}/${config.name}`)
      .reply(404);
    mockedSubservice = nock(config.url)
      .post(constants.apiCommunity, {
        name: config.name
      })
      .reply(201, {
        data: {
          id,
          name: config.name,
          attributes: {},
          created_epoch: 1512562469,
          deleted_epoch: null
        }
      });
  }

  function expectCommunityIdToHaveId_1(id) {
    expect(id).to.equal(1);
    expectCommunityOkAndMockedServerDone();
  }

  function expectCommunityIdToHaveId_2(id) {
    expect(id).to.equal(2);
    expectCommunityOkAndMockedServerDone();
  }

  function arrangeCommunityQueryToRespondItIsDead() {
    const endpoint = getQueryEndpoint();
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .replyWithError('Nope, query POST is dead');
  }

  function arrangeNonexistingUserForUpdate() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const profileId = 123;
    const endpoint = constants.apiProfileId(communityId, profileId);
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .reply(404, {
        errors: [
          {
            status: 404,
            code: '404',
            title: 'Profile does not exist',
            details: {problem: `Profile ${profileId} does not exist`}
          }
        ]
      });
  }

  function arrangeGetProfileToRespondItIsDead() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiProfileId(communityId, 123);
    mockedSubservice = nock(config.url)
      .get(endpoint)
      .replyWithError('Nope, profile GET is dead');
  }

  function arrangePutProfileToRespondItIsDead() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiProfileId(communityId, 123);
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .replyWithError('Nope, profile PUT is dead');
  }

  function arrangeGetEntityToRespondItIsDead(entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    mockedSubservice = nock(config.url)
      .get(endpoint)
      .replyWithError('Nope, entity GET is dead');
  }

  function expectNotFound(document) {
    expect(document.status === 404);
    expect(document).to.match(/not found/i);
  }

  function arrangeGetProfileReturnsUserWithIdAndNoOtherData(profileId) {
    const communityId = 1;
    const endpoint = getProfileIdEndpoint(profileId, communityId);
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .reply(200, {
        data: {
          id: profileId,
          community_id: communityId,
          attributes: {
            user_id: 'something',
            shortlist: [],
            tastes: []
          }
        }
      });
  }

  function arrangeGetEntityToRespondNotFound(entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    mockedSubservice = nock(config.url)
      .get(endpoint)
      .reply(404, {
        errors: [
          {
            status: 404,
            code: '404',
            title: 'Entity does not exist',
            meta: {
              resource: `/v1/community/${communityId}/entity/${entityId}`
            },
            details: {
              problem: `Entity ${entityId} does not exist`
            }
          }
        ]
      });
  }

  const arrangedQueryResponseForListEntities = require('./fixtures/elvis-simple-query-for-list-entities-data');

  function arrangeQueryReponseWithListOfEntityUuidAndIds() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(200, {
        data: arrangedQueryResponseForListEntities
      });
  }

  function expectEntryListWithUuidAndIds(document) {
    expect(document).to.deep.equal(arrangedQueryResponseForListEntities.List);
  }

  function arrangePostProfileToRespondItIsDead() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiPostProfile(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .replyWithError('Nope, profile POST is dead');
  }

  function arrangePostProfileReturnsUserWithIdAndNoOtherData() {
    const communityId = 1;
    const profileId = 135;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiPostProfile(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(201, {
        data: {
          id: profileId,
          community_id: communityId,
          attributes: {
            shortlist: [],
            tastes: [],
            user_id: 'something-id'
          }
        }
      });
  }

  function expectMalformedProfile(document) {
    const problems = document.meta.problems;
    expect(problems).to.include('field name is the wrong type');
    expect(problems).to.include('field attributes is required');
    expectCommunityOkAndMockedServerDone();
  }

  function arrangePostEntityToRespondItIsDead() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiPostEntity(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .replyWithError('Nope, entity POST is dead');
  }

  function arrangePutEntityToRespondNotBelongToCommunity(entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .reply(400, {
        errors: [
          {
            status: 400,
            code: '400',
            title: 'Entity does not belong to community',
            meta: {
              resource: '/v1/community/536/entity/1116'
            },
            details: {
              problem: 'Entity 1116 does not belong to community 536'
            }
          }
        ]
      });
  }

  function arrangeListEntityToBeDeleted(profileId, entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .reply(200, {
        links: {
          self: `/v1/community/1/entity/${entityId}`
        },
        data: {
          id: entityId,
          deleted_epoch: 1515603325,
          deleted_by: profileId,
          community_id: 1,
          owner_id: profileId,
          start_epoch: null,
          end_epoch: null,
          entity_ref: null,
          type: 'list',
          title: 'Deleted list',
          contents: 'Noget jeg gerne vil glemme',
          attributes: {
            list: [
              {
                pid: '870970-basis-47573974',
                description: 'Russisk forvekslingskomedie'
              }
            ],
            type: 'CUSTOM_LIST',
            uuid: '23e5d3928c2b4291986d1c3a43b1762c',
            public: false
          },
          log: null
        }
      });
  }

  function expectEntityNotFound(document) {
    expect(document).to.match(/does not exist/i);
    expectCommunityOkAndMockedServerDone();
  }

  function expectMalformedList(document) {
    const problems = document.meta.problems;
    expect(problems).to.include('field type is required');
    expect(problems).to.include('field title is required');
    expect(problems).to.include('field contents is required');
    expect(problems).to.include('field attributes is required');
    expectCommunityOkAndMockedServerDone();
  }

  function expectMalformedUpdateList(document) {
    const problems = document.meta.problems;
    expect(problems).to.include('data has additional properties');
    expectCommunityOkAndMockedServerDone();
  }

  function arrangePostEntityReturnsTrivialEntity() {
    const communityId = 1;
    const entityId = 1234;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiPostEntity(communityId);
    nock(config.url)
      .post(endpoint)
      .reply(201, {
        data: {
          id: entityId,
          modified_epoch: 1516115217,
          type: 'list',
          owner_id: 123,
          community_id: communityId,
          title: 'Brand New List',
          contents: 'A too long\ndescription with several\nlines',
          attributes: {
            type: 'WEIRD_INTERNAL_TYPE',
            public: false,
            uuid: 'd7c39653d7bf45be8a09c0c589cf56aa',
            list: [{pid: '1234-abc-5678', desription: 'a book'}]
          }
        }
      });
    mockedSubservice = nock(config.url)
      .get(constants.apiProfileId(communityId, 123))
      .reply(200, {
        data: {
          id: 123,
          modified_epoch: 1516115217,
          community_id: communityId,
          name: 'Mr Bean',
          attributes: {
            openplatform_id: '1234567890',
            shortlist: [],
            tastes: []
          }
        }
      });
  }

  function expectListWithExtraInfo(document) {
    expect(document).to.deep.equal({
      data: {
        type: 'WEIRD_INTERNAL_TYPE',
        title: 'Brand New List',
        description: 'A too long\ndescription with several\nlines',
        public: false,
        owner: '1234567890',
        list: [{pid: '1234-abc-5678', desription: 'a book'}]
      },
      links: {
        self: '/v1/lists/d7c39653d7bf45be8a09c0c589cf56aa',
        uuid: 'd7c39653d7bf45be8a09c0c589cf56aa',
        profile_id: 123,
        entity_id: 1234
      }
    });
  }

  function arrangeGetProfileToReturnNotFound(profileId) {
    const communityId = 1;
    const endpoint = getProfileIdEndpoint(profileId, communityId);
    mockedSubservice = nock(config.url)
      .get(endpoint)
      .reply(404, {
        status: 404,
        code: '404',
        title: 'Profile does not exist',
        meta: {
          resource: `/v1/community/${communityId}/profile/${profileId}`
        },
        details: {
          problem: `Profile ${profileId} does not exist`
        }
      });
  }

  function expectProfileNotFound(document) {
    expect(document.status).to.equal(404);
    expectCommunityOkAndMockedServerDone();
  }

  function arrangeQueryToReturnListOfEntities() {
    const fullQueryResponseForListEntities = require('./fixtures/elvis-full-query-for-list-entities-data');
    const endpoint = getQueryEndpoint();
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(200, {
        data: fullQueryResponseForListEntities
      });
  }

  function arrangeGetProfileToReturnAllUserData(profileId) {
    const endpoint = getProfileIdEndpoint(profileId);
    mockedSubservice = nock(config.url)
      .get(endpoint)
      .reply(200, {
        data: {
          id: profileId,
          name: 'Jens Godfredsen',
          attributes: {
            openplatform_id: '61dd1242cf774818a97a4ca2f3e633b1',
            openplatform_token: 'myToken',
            tastes: [
              {
                name: 'Med på den værste',
                moods: ['frygtelig'],
                genres: ['Noveller'],
                authors: ['Hanne Vibeke Holst'],
                archetypes: ['hestepigen']
              }
            ],
            shortlist: [{pid: '870970-basis-22629344', origin: 'en-god-bog'}]
          }
        }
      });
  }

  function expectUserDataToBeFullyPopulated(document) {
    expect(document).to.deep.equal({
      openplatformId: '61dd1242cf774818a97a4ca2f3e633b1',
      openplatformToken: 'myToken',
      name: 'Jens Godfredsen',
      roles: [],
      shortlist: [{pid: '870970-basis-22629344', origin: 'en-god-bog'}],
      profiles: [
        {
          name: 'Med på den værste',
          profile: {
            moods: ['frygtelig'],
            genres: ['Noveller'],
            authors: ['Hanne Vibeke Holst'],
            archetypes: ['hestepigen']
          }
        }
      ]
    });
    expectCommunityOkAndMockedServerDone();
  }

  function expectUserDataToHoldAllEntities(document) {
    expect(document).to.deep.equal([
      {
        data: {
          title: 'Another list',
          description: 'An oldie but goodie',
          list: [
            {
              pid: '870970-basis-53188931',
              description: 'Whoa, what a story'
            }
          ],
          public: false,
          owner: 'nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f',
          type: 'SYSTEM_LIST'
        },
        links: {
          self: '/v1/lists/c98c23925f857c5dbe41f8c6e8f49978',
          uuid: 'c98c23925f857c5dbe41f8c6e8f49978',
          entity_id: 4567,
          profile_id: 123
        }
      },
      {
        data: {
          title: 'My list',
          description: 'A brand new list',
          list: [
            {
              pid: '870970-basis-22629344',
              description: 'Magic to the people'
            }
          ],
          public: false,
          owner: 'nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f',
          type: 'CUSTOM_LIST'
        },
        links: {
          self: '/v1/lists/98c5ff8c6e8f49978c857c23925dbe41',
          uuid: '98c5ff8c6e8f49978c857c23925dbe41',
          entity_id: 4568,
          profile_id: 123
        }
      }
    ]);
    expectCommunityOkAndMockedServerDone();
  }

  function expectResponseToHoldList(profileId, entityId) {
    return document => {
      expect(document).to.deep.equal({
        data: {
          type: 'SYSTEM_LIST',
          title: 'My List',
          description: 'A brand new list',
          list: [
            {
              pid: '870970-basis-22629344',
              description: 'Magic to the people'
            }
          ],
          public: false,
          owner: '1234567890'
        },
        links: {
          self: '/v1/lists/fc8fbafab2a94bfaae5f84b1d5bfd480',
          uuid: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
          entity_id: entityId,
          profile_id: profileId
        }
      });
    };
  }

  function arrangeCommunityQueryToRespondUserIdNotFound() {
    const endpoint = getQueryEndpoint();
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(400, {
        errors: [
          {
            status: 400,
            code: '400',
            title: 'Error during execution of query',
            detail: 'No result from singleton selector',
            meta: {
              query: {
                Profile: {
                  'attributes.openplatform_id': 'ost'
                },
                Include: 'id'
              },
              subquery: {
                'attributes.openplatform_id': 'ost'
              },
              context: {}
            }
          }
        ]
      });
  }

  function arrangeCommunityQueryToRespondWithFoundProfileId() {
    const endpoint = getQueryEndpoint();
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(200, {
        data: 123
      });
  }

  function arrangePutEntityToRespondItIsDead(entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .replyWithError('Nope, entity PUT is dead');
  }

  function arrangePutEntityToRespondNotFound(entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .reply(404, {
        errors: [
          {
            status: 404,
            code: '404',
            title: 'Entity does not exist',
            details: {problem: `Entity ${entityId} does not exist`}
          }
        ]
      });
  }

  function arrangePutEntityToReturnTrivialEntity(entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    nock(config.url)
      .put(endpoint)
      .reply(200, {
        data: {
          id: entityId,
          modified_epoch: 1516115217,
          type: 'list',
          owner_id: 123,
          community_id: communityId,
          title: 'Brand New List',
          contents: 'A too long\ndescription with several\nlines',
          attributes: {
            type: 'WEIRD_INTERNAL_TYPE',
            public: false,
            uuid: 'd7c39653d7bf45be8a09c0c589cf56aa',
            list: [{pid: '1234-abc-5678', desription: 'a book'}]
          }
        }
      });
    mockedSubservice = nock(config.url)
      .get(constants.apiProfileId(communityId, 123))
      .reply(200, {
        data: {
          id: 123,
          modified_epoch: 1516115217,
          community_id: communityId,
          name: 'Mr Bean',
          attributes: {
            openplatform_id: '1234567890',
            roles: [],
            shortlist: [],
            tastes: []
          }
        }
      });
  }

  function arrangeQueryToReturnList(uuid) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(200, {
        data: {
          entity_id: 1,
          type: 'SYSTEM_LIST',
          title: 'My List',
          description: 'A brand new list',
          profile_id: 1,
          uuid: uuid,
          owner: 'ost',
          list: [
            {
              pid: '870970-basis-22629344',
              description: 'Magic to the people'
            }
          ],
          public: false
        }
      });
  }

  function arrangeQueryToReturnListNotFound() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(400, {
        errors: [
          {
            status: 400,
            code: '400',
            title: 'Error during execution of query',
            detail: 'No result from singleton selector',
            meta: {}
          }
        ]
      });
  }

  // HERE

  function arrangeGetEntityToRespondWithPrivateEntity(profileId, entityId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiEntityId(communityId, entityId);
    nock(config.url)
      .get(endpoint)
      .reply(200, {
        links: {
          self: `/v1/community/${communityId}/entity/${entityId}`
        },
        data: {
          id: entityId,
          created_epoch: 1515409049,
          deleted_epoch: null,
          modified_epoch: 1515409049,
          modified_by: null,
          deleted_by: null,
          community_id: communityId,
          owner_id: profileId,
          start_epoch: null,
          end_epoch: null,
          entity_ref: null,
          type: 'list',
          title: 'My List',
          contents: 'A brand new list',
          attributes: {
            list: [
              {
                pid: '870970-basis-22629344',
                description: 'Magic to the people'
              }
            ],
            type: 'SYSTEM_LIST',
            uuid: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
            public: false
          },
          log: null
        }
      });
    mockedSubservice = nock(config.url)
      .get(constants.apiProfileId(communityId, profileId))
      .reply(200, {
        data: {
          id: profileId,
          modified_epoch: 1516115217,
          community_id: communityId,
          name: 'Mr Bean',
          attributes: {
            openplatform_id: '1234567890',
            roles: [],
            shortlist: [],
            tastes: []
          }
        }
      });
  }

  function arrangeCommunityQueryToReturnNoMoreLists() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(200, {
        data: {
          Total: 10,
          NextOffset: null,
          List: []
        }
      });
  }

  function expectEmptyListOfLists(document) {
    expect(document).to.deep.equal({
      lists: [],
      total: 10,
      next_offset: null
    });
  }

  function arrangeCommunityToReturnTwoOutOfFourPublicLists() {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(200, {
        data: {
          Total: 4,
          NextOffset: 2,
          List: [
            {
              entity_id: 1623,
              profile_id: 543,
              uuid: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
              owner: 'nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f',
              public: true,
              type: 'SYSTEM_LIST',
              title: 'My List',
              description: 'A brand new list',
              list: [
                {
                  pid: '870970-basis-22629344',
                  description: 'Magic to the people'
                }
              ]
            },
            {
              entity_id: 1624,
              profile_id: 543,
              uuid: 'fa4f3a3de3a34a188234ed298ecbe810',
              owner: 'nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f',
              public: true,
              type: 'CUSTOM_LIST',
              title: 'Gamle Perler',
              description: 'Bøger man simpelthen må læse',
              list: [
                {
                  pid: '870970-basis-47573974',
                  description: 'Russisk forvekslingskomedie'
                }
              ]
            }
          ]
        }
      });
  }

  function expectTwoOutOfFourPublicLists(document) {
    expect(document).to.deep.equal({
      lists: [
        {
          data: {
            description: 'A brand new list',
            list: [
              {
                description: 'Magic to the people',
                pid: '870970-basis-22629344'
              }
            ],
            public: true,
            owner: 'nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f',
            title: 'My List',
            type: 'SYSTEM_LIST'
          },
          links: {
            entity_id: 1623,
            profile_id: 543,
            self: '/v1/lists/fc8fbafab2a94bfaae5f84b1d5bfd480',
            uuid: 'fc8fbafab2a94bfaae5f84b1d5bfd480'
          }
        },
        {
          data: {
            description: 'Bøger man simpelthen må læse',
            list: [
              {
                description: 'Russisk forvekslingskomedie',
                pid: '870970-basis-47573974'
              }
            ],
            public: true,
            owner: 'nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f',
            title: 'Gamle Perler',
            type: 'CUSTOM_LIST'
          },
          links: {
            entity_id: 1624,
            profile_id: 543,
            self: '/v1/lists/fa4f3a3de3a34a188234ed298ecbe810',
            uuid: 'fa4f3a3de3a34a188234ed298ecbe810'
          }
        }
      ],
      total: 4,
      next_offset: 2
    });
  }

  function expectProfileId(document) {
    expect(document).to.equal(123);
    expectCommunityOkAndMockedServerDone();
  }

  function expectError_UserIdNotFound(document) {
    expect(document.status).to.equal(404);
    expect(document.title).to.match(/not found/i);
    expect(document.detail).to.match(/does not exist.+or.+deleted/i);
    expectCommunityOkAndMockedServerDone();
  }

  function expectError_ListNotFound(document) {
    expect(document.status).to.equal(404);
    expect(document.title).to.match(/not found/i);
    expect(document.detail).to.match(/does not exist.+or.+deleted/i);
    expectCommunityOkAndMockedServerDone();
  }

  function getProfileIdEndpoint(profileId, communityId = 1) {
    sut.setCommunityId(communityId);
    return constants.apiProfileId(communityId, profileId);
  }

  function getQueryEndpoint(communityId = 1) {
    sut.setCommunityId(communityId);
    return constants.apiQuery(communityId);
  }

  function expectCommunityOkAndMockedServerDone() {
    expect(mockedSubservice.isDone()).to.be.true;
    expectCommunityOkAndNoErrors();
  }

  function expectCommunityOkAndNoErrors() {
    expect(sut.isOk()).to.be.true;
    expect(sut.getCurrentError()).to.be.null;
    expect(sut.getErrorLog()).to.have.length(0);
  }
});
