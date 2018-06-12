'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;
const coverTable = constants.covers.table;
const tagTable = constants.tags.table;
const cookieTable = constants.cookies.table;
const objectTable = constants.objects.table;
const topTable = constants.taxonomy.topTable;
const middleTable = constants.taxonomy.middleTable;
const bottomTable = constants.taxonomy.bottomTable;
const books = require('server/books');
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const resolve = require('resolve');

exports.seed = async knex => {
  {
    const blendstrup = require('fixtures/blendstrup-havelaagebogen.json');
    const meta = await books.parsingMetaDataInjection(blendstrup);
    const spiked = books.transformMetaDataToBook(meta);
    await knex(bookTable).insert(spiked);
    const image = await readFileAsync(
      resolve.sync('fixtures/870970-basis-53188931.jpg')
    );
    await knex(coverTable).insert({pid: meta.pid, image: image});
  }
  {
    const martin = require('fixtures/martin-den-herreloese-ridder.json');
    const meta = await books.parsingMetaDataInjection(martin);
    const spiked = books.transformMetaDataToBook(meta);
    await knex(bookTable).insert(spiked);
    const image = await readFileAsync(
      resolve.sync('fixtures/870970-basis-51752341.jpg')
    );
    await knex(coverTable).insert({pid: meta.pid, image: image});
    const tags = require('fixtures/martin-den-herreloese-ridder-tags.json');
    for (let tag of tags.selected) {
      await knex(tagTable).insert({pid: tags.pid, tag: tag.id});
    }
  }
  {
    const tags = require('fixtures/carter-mordoffer-tags.json');
    for (let tag of tags.selected) {
      await knex(tagTable).insert({pid: tags.pid, tag: tag.id});
    }
  }
  {
    const taxonomy = require('fixtures/small-taxonomy.json');
    const topRawInsert = [];
    const middleRawInsert = [];
    const bottomRawInsert = [];
    for (let top of taxonomy) {
      topRawInsert.push({id: top.id, title: top.title});
      for (let middle of top.items) {
        middleRawInsert.push({id: middle.id, top: top.id, title: middle.title});
        for (let bottom of middle.items) {
          bottomRawInsert.push({
            id: bottom.id,
            middle: middle.id,
            title: bottom.title
          });
        }
      }
    }
    await knex(topTable).insert(topRawInsert);
    await knex(middleTable).insert(middleRawInsert);
    await knex(bottomTable).insert(bottomRawInsert);
  }
  await knex(cookieTable).insert([
    {
      cookie: 'valid-login-token-for-user-seeded-on-test-start',
      community_profile_id: 123456,
      openplatform_id: '123openplatformId456',
      openplatform_token: '123openplatformToken456',
      expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
    },
    {
      cookie: 'valid-login-token-for-user2-seeded-on-test-start',
      community_profile_id: 234566,
      openplatform_id: '123openplatformId2',
      openplatform_token: '123openplatformToken2',
      expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
    },
    {
      cookie: 'expired-login-token',
      community_profile_id: 123456,
      openplatform_id: '123openplatformId456',
      openplatform_token: '123openplatformToken456',
      expires_epoch_s: Math.ceil(new Date(2009, 1, 25).getTime() / 1000)
    }
  ]);
  await addUserProfileObjects({
    profileId: 123456,
    openplatformId: '123openplatformId456'
  });
  async function addUserProfileObjects({profileId, openplatformId}) {
    const userProfile = {
      id: profileId,
      created_epoch: 1517919638,
      name: `testuser ${profileId}`,
      openplatformId,
      image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
      roles: [],
      acceptedTerms: true,
      profiles: [],
      lists: [
        {
          data: {
            created_epoch: 1522753045,
            modified_epoch: 1522753045,
            owner: openplatformId,
            public: false,
            social: false,
            open: false,
            type: 'SYSTEM_LIST',
            title: 'Har læst',
            description: 'En liste over læste bøger',
            list: []
          },
          links: {self: '/v1/lists/830e113a-e2f3-44a6-8d4c-3918668b5769'}
        },
        {
          data: {
            created_epoch: 1522753045,
            modified_epoch: 1522753045,
            owner: openplatformId,
            public: false,
            social: false,
            open: false,
            type: 'SYSTEM_LIST',
            title: 'Vil læse',
            description: 'En liste over bøger jeg gerne vil læse',
            list: []
          },
          links: {self: '/v1/lists/7c4a330b-750f-460a-8b17-00bab11a2c6f'}
        }
      ]
    };

    const userShortlist = {
      shortlist: [
        {pid: '870970-basis:52041082', origin: 'Fra "En god bog"'},
        {pid: '870970-basis:26296218', origin: 'Fra "En god bog"'},
        {pid: '870970-basis:52817757', origin: 'Fra "En god bog"'}
      ]
    };

    await knex(objectTable)
      .where('owner', openplatformId)
      .del();

    await knex(objectTable).insert([
      {
        id: 'bcdf3130-6ee5-11e8-9bfb-770000000001',
        rev: '1520339806500-lqkal2jnjn',
        owner: openplatformId,
        type: 'USER_SHORTLIST',
        key: '',
        public: false,
        created: 1528879363,
        modified: 1530533989,
        data: userShortlist
      },
      {
        id: 'bcdf3130-6ee5-11e8-9bfb-770000000002',
        rev: '1520339806512-lqkal2jnmm',
        owner: openplatformId,
        type: 'USER_PROFILE',
        key: '',
        public: true,
        created: 1528879363,
        modified: 1530533989,
        data: userProfile
      }
    ]);
  }
};
