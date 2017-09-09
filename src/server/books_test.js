/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const books = require('./books');
const blendstrup = require('fixtures/blendstrup-havelaagebogen.json');
const wrongBook = require('fixtures/wrong-book.json');
// const config = require('server/config');
// const logger = require('__/logging')(config.logger);

describe('books', () => {
  describe('parsingMetaDataInjection', () => {
    it('should complain about missing or wrong values in JSON', () => {
      return expect(books.parsingMetaDataInjection(wrongBook))
        .to.be.rejected
        .then(error => {
          expect(error).to.have.property('title');
          expect(error.title).to.match(/does not adhere to schema/);
          expect(error).to.have.property('meta');
          expect(error.meta).to.have.property('problems');
          const problems = error.meta.problems;
          expect(problems).to.be.an('array');
          expect(problems).to.deep.include('pid is the wrong type');
          expect(problems).to.deep.include('bibliographicRecordId is the wrong type');
          expect(problems).to.deep.include('loancount is the wrong type');
          expect(problems).to.deep.include('workId is required');
          expect(problems).to.deep.include('creator is required');
          expect(problems).to.deep.include('title is required');
          expect(problems).to.deep.include('titleFull is required');
          expect(problems).to.deep.include('type is required');
          expect(problems).to.deep.include('workType is required');
          expect(problems).to.deep.include('language is required');
          expect(problems).to.deep.include('image_detail is required');
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
          bibliographic_record_id: '53188931',
          items: 196,
          libraries: 80,
          pages: 645,
          loan_count: 1020,
          cover: 'https://moreinfo.addi.dk/2.9/more_info_get.php?lokalid=53188931&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d2cc02a57d78c7015725'
        });
      //          logger.log.debug(errors.meta.problems);
    });
  });
  describe('transformMetaDataToBook', () => {
    it('should fit the database schema', () => {
      return expect(books.parsingMetaDataInjection(blendstrup))
        .to.not.be.rejected
        .then(metaData => {
          expect(books.transformMetaDataToBook(metaData)).to.deep.equal({
            pid: '870970-basis:53188931',
            creator: 'Jens Blendstrup',
            title: 'Havelågebogen',
            title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
            language: 'Dansk',
            type: 'Bog',
            items: 196,
            libraries: 80,
            pages: 645,
            loan_count: 1020
          });
        });
    });
  });
});
