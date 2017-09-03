'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;
const coverTable = constants.covers.table;
const books = require('__/books');
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

exports.seed = knex => {
  const blendstrup = require('__/fixtures/blendstrup-havelaagebogen.json');
  const meta = books.parseMetaDataInjection(blendstrup);
  return knex(bookTable).insert(books.transformMetaDataToBook(meta))
    .then(() => {
      readFileAsync('src/lib/fixtures/870970-basis-53188931.391x500.jpg');
    })
    .then(contents => {
      return knex(coverTable).insert({
        pid: meta.pid,
        image: contents
      });
    })
    .catch(error => {
      throw error;
    });
};
