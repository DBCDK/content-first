/* eslint-env mocha */
'use strict';

module.exports = {
  cachedPublicListUuid,
  deletedListUuid,
  knownUserId,
  reservedListUuid,
  seedingCommunity,
  uncachedPrivateListUuid
};

const community = require('server/community');
const transform = require('__/services/elvis/transformers');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const listTable = constants.lists.table;
const uuidv4 = require('uuid/v4');

async function seedingCommunity() {
  setupRandomCommunityName();
  const {
    profile,
    lists
  } = transform.contentFirstUserToCommunityProfileAndEntities(profileSeed);
  const data = await community.creatingUserProfile(profile);
  const profileId = data.id;
  await community.updatingProfileWithShortlistAndTastes(profileId, {
    attributes: {
      openplatform_id: this.knownUserId(),
      openplatform_token: 'someToken'
    }
  });
  await knex(cookieTable).insert({
    cookie: 'a-valid-login-token',
    community_profile_id: profileId,
    expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
  });
  await knex(cookieTable).insert({
    cookie: 'another-valid-login-token',
    community_profile_id: profileId + 1,
    expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
  });

  const result = await community.creatingListEntity(profileId, lists[0]);
  const firstId = result.links.entity_id;
  await community.creatingListEntity(profileId, lists[1]);
  await addingListAndDeleteIt(profileId);
  await cachingOneList(profileId, firstId);
  await addingListReservation(profileId);

  const data2 = await community.creatingUserProfile(profile);
  const profileId2 = data2.id;
  await community.updatingProfileWithShortlistAndTastes(profileId2, {
    attributes: {
      openplatform_id: '123openplatform-id-for-user-2',
      openplatform_token: 'someToken2'
    }
  });
  await knex(cookieTable).insert({
    cookie: 'a-valid-login-token-for-other-user',
    community_profile_id: profileId2,
    expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
  });
}

async function addingListAndDeleteIt(profileId) {
  const toDelete = transform.contentFirstListToCommunityEntity(listToDelete);
  const result = await community.creatingListEntity(profileId, toDelete);
  await community.deletingListEntity(profileId, result.links.entity_id);
}

function addingListReservation(profileId) {
  const uuid = reservedListUuid();
  return knex(listTable).insert({
    uuid,
    community_profile_id: profileId
  });
}

function cachedPublicListUuid() {
  return profileSeed.lists[0].id;
}

function uncachedPrivateListUuid() {
  return profileSeed.lists[1].id;
}

function deletedListUuid() {
  return listToDelete.id;
}

function reservedListUuid() {
  return 'd7c39653d7bf45be8a09c0c589cf56aa';
}

function knownUserId() {
  return 'u9YaYSg6MlduZVnCkhv4N0wnt8g7Oa+f';
}

async function cachingOneList(profileId, entityId) {
  const line = {
    uuid: cachedPublicListUuid(),
    community_profile_id: profileId,
    community_entity_id: entityId
  };
  await knex(listTable).insert(line);
}

function setupRandomCommunityName() {
  // Work around for Elvis considering strings that can be converted to numbers as ids.
  config.community.name = 'X' + uuidv4();
  community.clear();
}

const profileSeed = {
  name: 'Jens Godfredsen',
  shortlist: [
    {
      pid: '870970-basis-22629344',
      origin: 'en-god-bog'
    }
  ],
  lists: [
    {
      id: 'fc8fbafab2a94bfaae5f84b1d5bfd480',
      type: 'SYSTEM_LIST',
      public: true,
      open: true,
      social: true,
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
      id: 'fa4f3a3de3a34a188234ed298ecbe810',
      type: 'CUSTOM_LIST',
      open: false,
      social: false,
      public: false,
      title: 'Gamle Perler',
      description: 'Bøger man simpelthen må læse',
      list: [
        {
          pid: '870970-basis-47573974',
          description: 'Russisk forvekslingskomedie'
        }
      ]
    }
  ],
  profiles: [
    {
      name: 'Med på den værste',
      profile: {
        moods: ['Åbent fortolkningsrum', 'frygtelig', 'fantasifuld'],
        authors: ['Hanne Vibeke Holst', 'Anne Lise Marstrand Jørgensen'],
        genres: ['Brevromaner', 'Noveller'],
        archetypes: ['hestepigen']
      }
    }
  ]
};

const listToDelete = {
  id: '23e5d3928c2b4291986d1c3a43b1762c',
  type: 'CUSTOM_LIST',
  title: 'Deleted list',
  description: 'Noget jeg gerne vil glemme',
  list: [
    {
      pid: '870970-basis-47573974',
      description: 'Russisk forvekslingskomedie'
    }
  ]
};
