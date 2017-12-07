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

  const community = new Community(config, logger);

  beforeEach(() => {
    community.clear();
  });

  let mockedSubservice;

  afterEach(nock.cleanAll);

  describe('with unreachable service', () => {

    it('should say there is no connection', () => {
      arrangeCommunityToRespondItIsDead();
      return expect(community.gettingCommunityId())
      .to.be.rejectedWith(Error)
      .then(error => {
        expectCommunityIsDead(error);
      });
    });
  });

  describe('with responsive service', () => {

    it('should say that everything is ok initially', () => {
      expectOkAndNoErrors();
    });

    it('should get existing community id', () => {
      arrangeExistingCommunityWIthId(2);
      return community.gettingCommunityId()
      .then(expectCommunityIdToHaveId_2);
    });

    it('should only ask subservice once for existing community id', () => {
      arrangeExistingCommunityWIthId(2);
      return community.gettingCommunityId()
      .then(() => {
        return community.gettingCommunityId();
      })
      .then(expectCommunityIdToHaveId_2);
    });

    it('should create a community when none exists', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(1);
      return community.gettingCommunityId()
      .then(expectCommunityIdToHaveId_1);
    });

    it('should remember community id after creation', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(2);
      return community.gettingCommunityId()
      .then(expectCommunityIdToHaveId_2);
    });

    it('should only ask subservice once for the community', () => {
      arrangeCommunityToNotExistButBeCreatedWithId(2);
      return community.gettingCommunityId()
      .then(() => {
        return community.gettingCommunityId();
      })
      .then(expectCommunityIdToHaveId_2);
    });
  });

  function arrangeCommunityToRespondItIsDead () {
    const slug = `${constants.apiCommunity}/${constants.communityName}`;
    mockedSubservice = nock(config.url).get(slug).replyWithError(
      'Nope, the Community is dead'
    );
  }

  function expectOkAndNoErrors () {
    expect(community.isOk()).to.be.true;
    expect(community.getCurrentError()).to.be.null;
    expect(community.getErrorLog()).to.have.length(0);
  }

  function expectCommunityIsDead (document) {
    const matcher = /community is dead/i;
    expect(document).to.match(matcher);
    expect(community.isOk()).to.be.false;
    expect(community.getCurrentError()).to.match(/community.+communication failed/i);
    const log = community.getErrorLog();
    expect(log).to.have.length(1);
    expect(log[0]).to.match(matcher);
    expect(mockedSubservice.isDone()).to.be.true;
  }

  function arrangeExistingCommunityWIthId (id) {
    const slug = `${constants.apiCommunity}/${constants.communityName}`;
    mockedSubservice = nock(config.url).get(slug).reply(200, {
      data: [{
        id,
        name: constants.communityName,
        attributes: [],
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
        attributes: [],
        created_epoch: 1512562469,
        deleted_epoch: null
      }]
    });
  }

  function expectCommunityIdToHaveId_1 (id) {
    expect(id).to.equal(1);
    expect(mockedSubservice.isDone()).to.be.true;
  }

  function expectCommunityIdToHaveId_2 (id) {
    expect(id).to.equal(2);
    expect(mockedSubservice.isDone()).to.be.true;
  }
});
