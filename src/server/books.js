/**
 * Utillties for backend service manipulation of book data.
 */

'use strict';
const _ = require('lodash');
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/book-in.json');

function parsingMetaDataInjection (obj) {
  return new Promise((resolve, reject) => {
    return validatingInput(obj, schema)
      .then(document => {
        let book = {};
        book.pid = document.pid;
        book.unit_id = document.unitId;
        book.work_id = document.workId;
        book.bibliographic_record_id = parseInt(document.bibliographicRecordId, 10);
        if (!book.bibliographic_record_id) {
          return reject({
            status: 400,
            title: 'bibliographicRecordId cannot be converted to an integer'
          });
        }
        book.title = document.title;
        book.creator = document.creator;
        book.title_full = document.titleFull;
        book.type = document.type;
        book.work_type = document.workType;
        book.language = document.language;
        book.libraries = document.libraries;
        book.loans = document.loans;
        book.pages = document.pages;
        book.items = document.items;
        book.cover = document.cover;
        book.taxonomy_description = document.taxonomy_description;
        book.description = document.description;
        const year = parseInt(document.dateFirstEdition, 10);
        book.first_edition_year = _.isNaN(year) ? 0 : year;
        book.subject = document.subject ? document.subject : '';
        book.genre = document.genre ? document.genre : '';
        book.literary_form = document.literaryForm ? document.literaryForm : '';
        resolve(book);
      })
      .catch(reject);
  });
}

function transformMetaDataToBook (metadata) {
  const filteredMetaData = _.pick(metadata, [
    'bibliographic_record_id',
    'creator',
    'items',
    'language',
    'libraries',
    'loans',
    'pages',
    'pid',
    'title',
    'title_full',
    'type',
    'unit_id',
    'work_id',
    'work_type',
    'taxonomy_description',
    'description',
    'subject',
    'genre',
    'literary_form',
    'first_edition_year'
  ]);
  return filteredMetaData;
}

module.exports = {
  parsingMetaDataInjection,
  transformMetaDataToBook
};
