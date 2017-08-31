'use strict';
const _ = require('lodash');

// TODO: Use validate-my-json?
function parseMetaDataInjection (obj) {
  let errors = [];
  let book = {};
  book.pid = obj.pid;
  if (typeof book.pid !== 'string') {
    errors.push(`"${obj.pid}" expected to be a PID.`);
  }
  book.unit_id = obj.unitId;
  if (typeof book.unit_id !== 'string') {
    errors.push(`"${obj.unitId}" expected to be an id.`);
  }
  book.work_id = obj.workId;
  if (typeof book.work_id !== 'string') {
    errors.push(`"${obj.workId}" expected to be an id.`);
  }
  book.bibliographic_record_id = obj.bibliographicRecordId;
  if (typeof book.bibliographic_record_id !== 'string') {
    errors.push(`"${obj.wbibliographicRecordId}" expected to be an id.`);
  }
  book.title = obj.title[0];
  if (typeof book.title !== 'string') {
    errors.push(`"${obj.title}" expected to be a book title.`);
  }
  book.creator = obj.creator[0];
  if (typeof book.creator !== 'string') {
    errors.push(`"${obj.creator}" expected to be a book author.`);
  }
  book.title_full = obj.titleFull[0];
  if (typeof book.title_full !== 'string') {
    errors.push(`"${obj.titleFull}" expected to be a full book title.`);
  }
  book.type = obj.type[0];
  if (typeof book.type !== 'string') {
    errors.push(`"${obj.type}" expected to be a book type.`);
  }
  book.work_type = obj.workType[0];
  if (typeof book.work_type !== 'string') {
    errors.push(`"${obj.workType}" expected to be a book type.`);
  }
  book.language = obj.language[0];
  if (typeof book.language !== 'string') {
    errors.push(`"${obj.language}" expected to be a book language.`);
  }
  book.cover = obj.image_detail_500;
  if (typeof book.cover !== 'string') {
    errors.push(`"${obj.image_detail_500}" expected to be a cover URL.`);
  }
  if (errors.length !== 0) {
    throw new Error(errors);
  }
  return book;
}
exports.parseMetaDataInjection = parseMetaDataInjection;

function transformMetaDataToBook (metadata) {
  return _.pick(metadata, [
    'pid',
    'creator',
    'title',
    'title_full',
    'language',
    'type'
  ]);
}
exports.transformMetaDataToBook = transformMetaDataToBook;
