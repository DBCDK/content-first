/* eslint-env mocha */
'use strict';

module.exports = {
  seedingCommunity
};

const community = require('server/community');
const transform = require('__/services/elvis/transformers');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const uuidv4 = require('uuid/v4');

async function seedingCommunity(openplatformId) {
  setupRandomCommunityName();
  const {profile, lists} = transform.transformFrontendUserToProfileAndEntities(
    profileSeed
  );
  const data = await community.creatingUserProfile(profile);
  const profileId = data.id;
  await community.updatingProfileWithShortlistAndTastes(profileId, {
    attributes: {
      openplatform_id: openplatformId
    }
  });
  await knex(cookieTable).insert({
    cookie: 'a-valid-login-token-seeded-on-test-start',
    community_profile_id: profileId,
    expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
  });

  let chain = Promise.resolve();
  for (const list of lists) {
    chain = chain.then(() => {
      return community.creatingListEntity(profileId, list);
    });
  }
  await chain;
}

function setupRandomCommunityName() {
  config.community.name = 'X' + uuidv4(); // Work around bug in Elvis.
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
