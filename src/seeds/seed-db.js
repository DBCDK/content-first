'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;
const coverTable = constants.covers.table;
const books = require('server/books');
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

exports.seed = async knex => {
  const blendstrup = require('fixtures/blendstrup-havelaagebogen.json');
  const meta = await books.parsingMetaDataInjection(blendstrup);
  await knex(bookTable).insert(books.transformMetaDataToBook(meta));
  const contents = await readFileAsync('src/fixtures/870970-basis-53188931.jpg');
  await knex(coverTable).insert({pid: meta.pid, image: contents});
};
