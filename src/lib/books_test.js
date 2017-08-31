/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const books = require('__/books');
const blendstrup = require('__/fixtures/blendstrup-havelaagebogen.json');

describe('books', () => {
  describe('parseMetaDataInjection', () => {
    it('should fill in all values from JSON', () => {
      expect(books.parseMetaDataInjection(blendstrup)).to.deep.equal({
        pid: '870970-basis:53188931',
        creator: 'Jens Blendstrup',
        title: 'Havelågebogen',
        title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
        language: 'Dansk',
        type: 'Bog',
        unit_id: 'unit:22125672',
        work_id: 'work:20137979',
        work_type: 'book',
        bibliographic_record_id: '53188931',
        cover: 'https://moreinfo.addi.dk/2.9/more_info_get.php?lokalid=53188931&attachment_type=forside_500&bibliotek=870970&source_id=870970&key=92ab02d98667aaf7a43f'
      });
    });
  });
  describe('transformMetaDataToBook', () => {
    it('should fit the database schema', () => {
      const metaData = books.parseMetaDataInjection(blendstrup);
      expect(books.transformMetaDataToBook(metaData)).to.deep.equal({
        pid: '870970-basis:53188931',
        creator: 'Jens Blendstrup',
        title: 'Havelågebogen',
        title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
        language: 'Dansk',
        type: 'Bog'
      });
    });
  });
});
