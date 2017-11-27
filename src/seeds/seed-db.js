'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;
const coverTable = constants.covers.table;
const tagTable = constants.tags.table;
const userTable = constants.users.table;
const cookieTable = constants.cookies.table;
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
    const image = await readFileAsync(resolve.sync('fixtures/870970-basis-53188931.jpg'));
    await knex(coverTable).insert({pid: meta.pid, image: image});
  }
  {
    const martin = require('fixtures/martin-den-herreloese-ridder.json');
    const meta = await books.parsingMetaDataInjection(martin);
    const spiked = books.transformMetaDataToBook(meta);
    await knex(bookTable).insert(spiked);
    const image = await readFileAsync(resolve.sync('fixtures/870970-basis-51752341.jpg'));
    await knex(coverTable).insert({pid: meta.pid, image: image});
    const tags = require('fixtures/martin-den-herreloese-ridder-tags.json');
    for (let tag of tags.selected) {
      await knex(tagTable).insert({pid: tags.pid, tag});
    }
  }
  {
    const tags = require('fixtures/carter-mordoffer-tags.json');
    for (let tag of tags.selected) {
      await knex(tagTable).insert({pid: tags.pid, tag});
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
          bottomRawInsert.push({id: bottom.id, middle: middle.id, title: bottom.title});
        }
      }
    }
    await knex(topTable).insert(topRawInsert);
    await knex(middleTable).insert(middleRawInsert);
    await knex(bottomTable).insert(bottomRawInsert);
  }
  await knex(userTable).insert({
    uuid: 'an-existing-user-seeded-on-test-start',
    // CPR 1212719873 => e27ecb7c5207c19d388a83631b87065d9667790543e4820f
    cpr: 'e27ecb7c5207c19d388a83631b87065d9667790543e4820f',
    name: 'Jens Godfredsen',
    profiles: JSON.stringify([{
      name: 'Med på den værste',
      profile: {
        moods: ['Åbent fortolkningsrum', 'frygtelig', 'fantasifuld'],
        authors: ['Hanne Vibeke Holst', 'Anne Lise Marstrand Jørgensen'],
        genres: ['Brevromaner', 'Noveller'],
        archetypes: ['hestepigen']
      }
    }])
  });
  await knex(cookieTable).insert({
    uuid: 'a-valid-login-token-seeded-on-test-start',
    user: 'an-existing-user-seeded-on-test-start',
    expires_epoch_s: (Math.ceil(Date.now() / 1000) + 10000)
  });
  await knex(cookieTable).insert({
    uuid: 'expired-login-token-seeded-on-test-start',
    user: 'an-existing-user-seeded-on-test-start',
    expires_epoch_s: Math.ceil(new Date(2009, 1, 25).getTime() / 1000)
  });
};
