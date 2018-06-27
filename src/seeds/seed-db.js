'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;
const coverTable = constants.covers.table;
const tagTable = constants.tags.table;
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
  await knex(cookieTable).insert({
    cookie: 'valid-login-token-for-user-seeded-on-test-start',
    community_profile_id: 123456,
    openplatform_id: '123openplatformId456',
    openplatform_token: '123openplatformToken456',
    expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
  });
  await knex(cookieTable).insert({
    cookie: 'valid-login-token-for-user2-seeded-on-test-start',
    community_profile_id: 234566,
    openplatform_id: '123openplatformId2',
    openplatform_token: '123openplatformToken2',
    expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
  });
  await knex(cookieTable).insert({
    cookie: 'expired-login-token',
    community_profile_id: 123456,
    openplatform_id: '123openplatformId456',
    openplatform_token: '123openplatformToken456',
    expires_epoch_s: Math.ceil(new Date(2009, 1, 25).getTime() / 1000)
  });
};
