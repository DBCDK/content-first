/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const books = require('./books');
const blendstrup = require('fixtures/blendstrup-havelaagebogen.json');
const wrongBook = require('fixtures/broken-book.json');

describe('books', () => {
  describe('parsingMetaDataInjection', () => {
    it('should complain about missing or wrong values in JSON', () => {
      return expect(books.parsingMetaDataInjection(wrongBook))
        .to.be.rejected
        .then(error => {
          expect(error).to.have.property('title');
          expect(error.title).to.match(/does not adhere to schema/i);
          expect(error).to.have.property('meta');
          expect(error.meta).to.have.property('problems');
          const problems = error.meta.problems;
          expect(problems).to.be.an('array');
          expect(problems).to.deep.include('field pid is the wrong type');
          expect(problems).to.deep.include('field bibliographicRecordId is the wrong type');
          expect(problems).to.deep.include('field loancount is the wrong type');
          expect(problems).to.deep.include('field workId is required');
          expect(problems).to.deep.include('field creator is required');
          expect(problems).to.deep.include('field title is required');
          expect(problems).to.deep.include('field titleFull is required');
          expect(problems).to.deep.include('field type is required');
          expect(problems).to.deep.include('field workType is required');
          expect(problems).to.deep.include('field language is required');
          expect(problems).to.deep.include('field image_detail is required');
          expect(problems).to.deep.include('field items is required');
          expect(problems).to.deep.include('field libraries is required');
          expect(problems).to.deep.include('field pages is required');
        });
    });
    it('should fill in all values from JSON', () => {
      return expect(books.parsingMetaDataInjection(blendstrup))
        .to.become({
          pid: '870970-basis:53188931',
          creator: 'Jens Blendstrup',
          title: 'Havelågebogen',
          title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
          language: 'Dansk',
          type: 'Bog',
          unit_id: 'unit:22125672',
          work_id: 'work:20137979',
          work_type: 'book',
          bibliographic_record_id: 53188931,
          items: 196,
          libraries: 80,
          pages: 645,
          loan_count: 1020,
          cover: 'https://moreinfo.addi.dk/2.9/more_info_get.php?lokalid=53188931&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d2cc02a57d78c7015725'
        });
    });
  });
  describe('transformMetaDataToBook', () => {
    it('should fit the database schema', () => {
      return expect(books.parsingMetaDataInjection(blendstrup))
        .to.not.be.rejected
        .then(metaData => {
          expect(books.transformMetaDataToBook(metaData)).to.deep.equal({
            bibliographic_record_id: 53188931,
            creator: 'Jens Blendstrup',
            items: 196,
            language: 'Dansk',
            libraries: 80,
            loan_count: 1020,
            pages: 645,
            pid: '870970-basis:53188931',
            title: 'Havelågebogen',
            title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
            type: 'Bog',
            unit_id: 'unit:22125672',
            work_id: 'work:20137979',
            description: 'Ingen beskrivelse',
            published_year: 2017,
            published_month: 2,
            published_day: 3,
            work_type: 'book'
          });
        });
    });
  });
});
