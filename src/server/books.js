'use strict';
const _ = require('lodash');
const validatingInput = require('server/json-verifiers').validatingInput;

function parsingMetaDataInjection (obj) {
  return new Promise((resolve, reject) => {
    return validatingInput(obj, 'schemas/book-in.json')
      .then(document => {
        let book = {};
        book.pid = document.pid;
        book.unit_id = document.unitId;
        book.work_id = document.workId;
        book.bibliographic_record_id = document.bibliographicRecordId;
        book.title = document.title;
        book.creator = document.creator;
        book.title_full = document.titleFull;
        book.type = document.type;
        book.work_type = document.workType;
        book.language = document.language;
        book.libraries = document.libraries;
        book.loan_count = document.loancount;
        book.pages = document.pages;
        book.items = document.items;
        book.cover = document.image_detail;
        resolve(book);
      })
      .catch(reject);
  });
}
exports.parsingMetaDataInjection = parsingMetaDataInjection;

function transformMetaDataToBook (metadata) {
  return _.pick(metadata, [
    'pid',
    'creator',
    'title',
    'title_full',
    'language',
    'type',
    'items',
    'libraries',
    'loan_count',
    'pages'
  ]);
}
exports.transformMetaDataToBook = transformMetaDataToBook;
