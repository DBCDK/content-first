/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const constants = require('./community-constants')();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nock = require('nock');
const sinon = require('sinon');
const Community = require('./community');

describe('Community connector', () => {

  const logger = {
    log: {
      debug: sinon.stub(),
      info: sinon.stub(),
      error: sinon.stub()
    }
  };

  const config = {
    url: 'http://localhost:3210'
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
      .then(error => {
        expectCommunityIsDead(error);
      });
    });

    it('should say that everything is ok initially', () => {
      expectOkAndNoErrors();
    });

    it('should get existing community id', () => {
      arrangeExistingCommunityWithId(2);
      return sut.gettingCommunityId()
      .then(expectCommunityIdToHaveId_2);
    });

    it('should only ask subservice once for existing community id', () => {
      arrangeExistingCommunityWithId(2);
      return sut.gettingCommunityId()
      .then(() => {
        return sut.gettingCommunityId();
      })
      .then(expectCommunityIdToHaveId_2);
    });

    it('should create a community when none exists', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(1);
      return sut.gettingCommunityId()
      .then(expectCommunityIdToHaveId_1);
    });

    it('should remember community id after creation', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(2);
      return sut.gettingCommunityId()
      .then(expectCommunityIdToHaveId_2);
    });

    it('should only ask subservice once for the community', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(2);
      return sut.gettingCommunityId()
      .then(() => {
        return sut.gettingCommunityId();
      })
      .then(expectCommunityIdToHaveId_2);
    });
  });

  describe('gettingProfileIdFromUuid', () => {

    it('should detect no connection', () => {
      arrangeQueryToRespondItIsDead();
      return expect(sut.gettingProfileIdFromUuid('uuid-that-does-not-exist'))
      .to.be.rejectedWith(Error)
      .then(error => {
        expectCommunityIsDead(error);
      });
    });

    it('should handle user disappeared', () => {
      arrangeNonexistingUserForQuery();
      return expect(sut.gettingProfileIdFromUuid('uuid-that-does-not-exist'))
      .to.be.rejectedWith(Error)
      .then(error => {
        expectUserNotFound(error);
      });
    });

    it('should return community profile ID', () => {
      const uuid = '2ce40c9c21124a78836d7dc19a2e90ab';
      const id = 123;
      arrangeUserWithUuidAndId(uuid, id);
      return sut.gettingProfileIdFromUuid(uuid)
      .then(x => {
        expect(x).to.equal(id);
      });
    });
  });

  describe('updatingProfileWithShortlistAndTastes', () => {

    it('should detect no connnection', () => {
      arrangeProfileToRespondItIsDead();
      return expect(sut.updatingProfileWithShortlistAndTastes(123, {}))
      .to.be.rejectedWith(Error)
      .then(error => {
        expectCommunityIsDead(error);
      });
    });

    it('should handle user disappeared', () => {
      arrangeNonexistingUserForUpdate();
      return expect(sut.updatingProfileWithShortlistAndTastes(123, {}))
      .to.be.rejectedWith(Error)
      .then(error => {
        expectNotFound(error);
      });
    });

    it('should accept shortlist & tastes update and handle success', () => {
      const profileId = 123;
      arrangeUserWithIdAndNoOtherData(profileId);
      return sut.updatingProfileWithShortlistAndTastes(profileId, {
        name: 'Jens Godfredsen',
        attributes: {
          shortlist: [
            {pid: '870970-basis-53188931', origin: 'en-let-læst-bog'},
            {pid: '870970-basis-51752341', origin: 'bibliotikarens-ugentlige-anbefaling'}
          ],
          tastes: [{
            name: 'En tynd en',
            moods: ['frygtelig'],
            authors: ['Carsten Jensen'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
          }, {
            name: 'Ny profile',
            moods: ['dramatisk'],
            authors: ['Helge Sander'],
            genres: ['Skæbnefortællinger', 'Horror'],
            archetypes: ['Goth']
          }]
        }
      });
    });
  });

  describe('gettingAllListEntitiesOwnedByUserWithId()', () => {

    it('should detect no connnection', () => {
      arrangeQueryToRespondItIsDead();
      return expect(sut.gettingAllListEntitiesOwnedByUserWithId(123))
      .to.be.rejectedWith(Error)
      .then(error => {
        expectCommunityIsDead(error);
      });
    });

    it('should handle success', () => {
      arrangeQueryReponseWithListOfEntityUuidAndIds();
      return sut.gettingAllListEntitiesOwnedByUserWithId(33)
      .then(response => {
        expectEntryListWithUuidAndIds(response);
      });
    });
  });

  //
  // Helpers.
  //

  function arrangeCommunityToRespondItIsDead () {
    const endpoint = `${constants.apiCommunity}/${constants.communityName}`;
    mockedSubservice = nock(config.url).get(endpoint).replyWithError(
      'Nope, Community GET is dead'
    );
  }

  function expectOkAndNoErrors () {
    expect(sut.isOk()).to.be.true;
    expect(sut.getCurrentError()).to.be.null;
    expect(sut.getErrorLog()).to.have.length(0);
  }

  function expectCommunityIsDead (document) {
    const matcher = /community.+is dead/i;
    expect(document).to.match(matcher);
    expect(sut.isOk()).to.be.false;
    expect(sut.getCurrentError()).to.match(/community.+communication failed/i);
    const log = sut.getErrorLog();
    expect(log).to.have.length(1);
    expect(log[0]).to.match(matcher);
    expect(mockedSubservice.isDone()).to.be.true;
  }

  function arrangeExistingCommunityWithId (id) {
    const slug = `${constants.apiCommunity}/${constants.communityName}`;
    mockedSubservice = nock(config.url).get(slug).reply(200, {
      data: [{
        id,
        name: constants.communityName,
        attributes: {},
        created_epoch: 1512554933,
        deleted_epoch: null
      }]
    });
  }

  function arrangeCommunityToNotExistButBeCreatedWithId (id) {
    nock(config.url).get(`${constants.apiCommunity}/${constants.communityName}`).reply(404);
    mockedSubservice = nock(config.url).post(constants.apiCommunity, {
      name: constants.communityName
    }).reply(201, {
      data: [{
        id,
        name: constants.communityName,
        attributes: {},
        created_epoch: 1512562469,
        deleted_epoch: null
      }]
    });
  }

  function expectCommunityIdToHaveId_1 (id) {
    expect(id).to.equal(1);
    expect(mockedSubservice.isDone()).to.be.true;
    expectOkAndNoErrors();
  }

  function expectCommunityIdToHaveId_2 (id) {
    expect(id).to.equal(2);
    expect(mockedSubservice.isDone()).to.be.true;
    expectOkAndNoErrors();
  }

  function arrangeQueryToRespondItIsDead () {
    sut.setCommunityId(1);
    const endpoint = constants.apiQuery(1);
    mockedSubservice = nock(config.url).post(endpoint).replyWithError(
      'Nope, Community POST is dead'
    );
  }

  function arrangeNonexistingUserForQuery () {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url).post(endpoint).reply(400, {
      errors: [{
        status: 400,
        code: '400',
        title: 'Error during execution of query',
        detail: 'No result from singleton selector'
      }]
    });
  }

  function arrangeNonexistingUserForUpdate () {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const profileId = 123;
    const endpoint = constants.apiProfile(communityId, profileId);
    mockedSubservice = nock(config.url).post(endpoint).reply(404, {
      errors: [{
        status: 404,
        code: '404',
        title: 'Profile does not exist',
        details: {problem: `Profile ${profileId} does not exist`}
      }]
    });
  }

  function expectUserNotFound (document) {
    const matcher = /user.+not found/i;
    expect(document).to.match(matcher);
    expect(mockedSubservice.isDone()).to.be.true;
    expectOkAndNoErrors();
  }

  function arrangeUserWithUuidAndId (uuid, id) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url).post(endpoint).reply(200, {
      data: id
    });
  }

  function arrangeProfileToRespondItIsDead () {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiProfile(communityId, 123);
    mockedSubservice = nock(config.url).post(endpoint).replyWithError(
      'Nope, Community POST is dead'
    );
  }

  function expectNotFound (document) {
    expect(document.status === 404);
    expect(document).to.match(/not found/i);
  }

  function arrangeUserWithIdAndNoOtherData (profileId) {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiProfile(communityId, profileId);
    mockedSubservice = nock(config.url).post(endpoint).reply(200, {
      data: {
        id: profileId,
        community_id: communityId,
        attributes: {}
      }
    });
  }

  const arrangedQueryResponseForListEntities = require('./fixtures/query-response-for-list-entities');

  function arrangeQueryReponseWithListOfEntityUuidAndIds () {
    const communityId = 1;
    sut.setCommunityId(communityId);
    const endpoint = constants.apiQuery(communityId);
    mockedSubservice = nock(config.url).post(endpoint).reply(200, {
      data: arrangedQueryResponseForListEntities
    });
  }

  function expectEntryListWithUuidAndIds (document) {
    expect(document).to.deep.equal(arrangedQueryResponseForListEntities);
  }
});
