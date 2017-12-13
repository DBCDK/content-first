/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {expect} = require('chai');
const transform = require('./transformers');

describe('User data transformers for Community Service', () => {

  const transformedUserInfo = require('./fixtures/community-data-from-user-info.json');

  describe('profileAndEntitiesFromFrontendUser', () => {

    it('should handle user data without any lists or tastes', () => {
      const output = transform.transformFrontendUserToProfileAndEntities({
        name: 'Jens Godfredsen',
        shortlist: [],
        profiles: [],
        lists: []
      });
      expect(output).to.deep.equal({
        profile: {
          name: 'Jens Godfredsen',
          attributes: {
            shortlist: [],
            tastes: []
          }
        },
        lists: []
      });
    });

    it('should handle complex user data', () => {
      const input = require('./fixtures/user-info-from-frontend.json');
      const output = transform.transformFrontendUserToProfileAndEntities(input);
      expect(output).to.deep.equal(transformedUserInfo);
    });
  });

  const queryResponseForListEntities = require('./fixtures/query-response-for-list-entities');

  describe('divideListsIntoCreateUpdateAndDelete', () => {

    it('should put each list in a seperate category', () => {
      const profileId = 123;
      const output = transform.divideListsIntoCreateUpdateAndDeleteForProfileId(
        transformedUserInfo.lists,
        queryResponseForListEntities.List,
        profileId
      );
      expect(output).to.deep.equal({
        toCreate: [{
          type: 'list',
          owner_id: profileId,
          title: 'My Other List',
          contents: 'Some old list',
          attributes: {
            uuid: 'dcbf8e7fb978459497fe4e08fc0fb9f4',
            type: 'CUSTOM_LIST',
            public: false,
            list: [{pid: '870970-basis-53188931', description: 'Idéer til haven'}]
          }
        }],
        toUpdate: [{
          id: 1,
          type: 'list',
          title: 'My List',
          contents: 'A brand new list',
          attributes: {
            uuid: '98c5ff8c6e8f49978c857c23925dbe41',
            type: 'SYSTEM_LIST',
            public: false,
            list: [{pid: '870970-basis-22629344', description: 'Magic to the people'}]
          }
        }],
        toDelete: [2]
      });
    });
  });

});
