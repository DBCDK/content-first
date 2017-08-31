'use strict';

const constants = require('server/constants')();
const bookTable = constants.books.table;
// const coverTable = constants.covers.table;
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

exports.seed = knex => {
  // const book = JSON.parse(fs.readFileSync('blendstrup-havelaagebogen.json', 'utf8'));
  return readFileAsync(`${__dirname}/blendstrup-havelaagebogen.json`, {encoding: 'utf8'})
    .then(book => {
      console.log(book);
      return knex(bookTable).insert({
        pid: book.pid,
        creator: book.creator[0],
        title: book.title[0],
        title_full: book.titleFull[0],
        type: book.type[0],
        language: book.language[0]
      });
    })
    .catch(error => {
      throw error;
    });
};
