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
      return expect(sut.creatingUserProfile({name: 123})).to.be.rejected.then(
        expectMalformedProfile
      );
    });

    const userInfo = require('./fixtures/frontend-user-info-out.json');
    const {profile} = transform.transformFrontendUserToProfileAndEntities(
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
      return expect(
        sut.creatingListEntity(123, {name: 123})
      ).to.be.rejected.then(expectMalformedList);
    });

    const userInfo = require('./fixtures/frontend-user-info-out.json');
    const {lists} = transform.transformFrontendUserToProfileAndEntities(
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
      return sut.creatingListEntity(profileId, input);
    });
  });

  describe('updatingListEntity', () => {
    it('should reject malformed input', () => {
      return expect(
        sut.updatingListEntity(1, 2, {name: 123})
      ).to.be.rejected.then(expectMalformedUpdateList);
    });

    const userInfo = require('./fixtures/frontend-user-info-out.json');
    const {lists} = transform.transformFrontendUserToProfileAndEntities(
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
      arrangeGetProfileAndEntitiesToReturnAllUserData(profileId);
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

  describe('gettingProfileIdByOpenplatformId', () => {
    it('should detect no connection', () => {
      arrangeCommunityQueryToRespondItIsDead();
      return expect(sut.gettingProfileIdByOpenplatformId('some-hash'))
        .to.be.rejectedWith(Error)
        .then(expectCommunityIsDead);
    });

    it('should handle non-existing userId', () => {
      arrangeCommunityQueryToRespondUserIdNotFound();
      return expect(
        sut.gettingProfileIdByOpenplatformId('some-hash')
      ).to.be.rejected.then(expectUserIdNotFound);
    });

    it('should return profile id for existing userId', () => {
      arrangeCommunityQueryToRespondWithFoundProfileId();
      return sut
        .gettingProfileIdByOpenplatformId('some-hash')
        .then(expectProfileId);
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
    mockedSubservice = nock(config.url)
      .post(endpoint)
      .reply(201, {
        data: {
          id: entityId,
          community_id: communityId,
          attributes: {}
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

  function arrangeGetProfileAndEntitiesToReturnAllUserData(profileId) {
    arrangeGetProfileToReturnAllUserData(profileId);
    arrangeQueryToReturnListOfEntities();
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
      name: 'Jens Godfredsen',
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
      ],
      lists: [
        {
          type: 'SYSTEM_LIST',
          title: 'Another list',
          description: 'An oldie but goodie',
          id: 'c98c23925f857c5dbe41f8c6e8f49978',
          public: false,
          list: [
            {
              pid: '870970-basis-53188931',
              description: 'Whoa, what a story'
            }
          ]
        },
        {
          type: 'CUSTOM_LIST',
          title: 'My list',
          description: 'A brand new list',
          id: '98c5ff8c6e8f49978c857c23925dbe41',
          public: false,
          list: [
            {
              pid: '870970-basis-22629344',
              description: 'Magic to the people'
            }
          ]
        }
      ],
      openplatformToken: undefined
    });
    expectCommunityOkAndMockedServerDone();
  }

  function expectUserDataToHoldAllEntities(document) {
    expect(document).to.deep.equal([
      {
        id: 'c98c23925f857c5dbe41f8c6e8f49978',
        title: 'Another list',
        description: 'An oldie but goodie',
        list: [
          {
            pid: '870970-basis-53188931',
            description: 'Whoa, what a story'
          }
        ],
        public: false,
        type: 'SYSTEM_LIST'
      },
      {
        id: '98c5ff8c6e8f49978c857c23925dbe41',
        title: 'My list',
        description: 'A brand new list',
        list: [
          {
            pid: '870970-basis-22629344',
            description: 'Magic to the people'
          }
        ],
        public: false,
        type: 'CUSTOM_LIST'
      }
    ]);
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
      .replyWithError('Nope, profile PUT is dead');
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
    mockedSubservice = nock(config.url)
      .put(endpoint)
      .reply(200, {
        data: {
          id: entityId,
          community_id: communityId,
          attributes: {}
        }
      });
  }

  function expectProfileId(document) {
    expect(document).to.equal(123);
    expectCommunityOkAndMockedServerDone();
  }

  function expectUserIdNotFound(document) {
    expect(document).to.match(/user.+not found/i);
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
