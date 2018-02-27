/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {expect} = require('chai');
const {
  contentFirstUserToCommunityProfileAndEntities,
  contentFirstListToCommunityEntity
} = require('./transformers');

describe('User data transformers for Community Service', () => {
  const input = require('./fixtures/frontend-user-info-out.json');

  describe('contentFirstListToCommunityEntity', () => {
    it('should default to private list', () => {
      const actual = contentFirstListToCommunityEntity(input.lists[0]);
      expect(actual).to.deep.equal({
        type: 'list',
        title: 'My List',
        contents: 'A brand new list',
        attributes: {
          uuid: '98c5ff8c6e8f49978c857c23925dbe41',
          type: 'SYSTEM_LIST',
          open: false,
          social: false,
          public: false,
          list: [
            {
              pid: '870970-basis-22629344',
              description: 'Magic to the people'
            }
          ],
          image: 'some-image-id',
          template: 'simple'
        }
      });
    });
    it('should accept a public list', () => {
      const actual = contentFirstListToCommunityEntity(input.lists[1]);
      expect(actual).to.deep.equal({
        type: 'list',
        title: 'My Other List',
        contents: 'Some old list',
        attributes: {
          uuid: 'dcbf8e7fb978459497fe4e08fc0fb9f4',
          type: 'CUSTOM_LIST',
          open: true,
          social: true,
          public: true,
          list: [
            {
              description: 'Idéer til haven',
              pid: '870970-basis-53188931'
            }
          ],
          image: 'some-image-id',
          template: 'simple'
        }
      });
    });
  });

  const transformedUserInfo = require('./fixtures/transformers-separated-user-info-out.json');

  describe('contentFirstUserToCommunityProfileAndEntities', () => {
    it('should leave out parts not mentioned in input', () => {
      const actual = contentFirstUserToCommunityProfileAndEntities({});
      expect(actual).to.deep.equal({
        profile: {
          attributes: {}
        }
      });
    });
  });

  describe('profileAndEntitiesFromFrontendUser', () => {
    it('should handle user data without any lists or tastes', () => {
      const output = contentFirstUserToCommunityProfileAndEntities({
        name: 'Jens Godfredsen',
        shortlist: [],
        profiles: [],
        lists: [],
        roles: ['basher'],
        image: ['http://via.placeholder.com/256']
      });
      expect(output).to.deep.equal({
        profile: {
          name: 'Jens Godfredsen',
          attributes: {
            shortlist: [],
            tastes: [],
            roles: ['basher'],
            image: ['http://via.placeholder.com/256']
          }
        },
        lists: []
      });
    });

    it('should handle complex user data', () => {
      const output = contentFirstUserToCommunityProfileAndEntities(input);
      expect(output).to.deep.equal(transformedUserInfo);
    });
  });
});
