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
          expect(error.title).to.match(/does not adhere to JSON schema/i);
          expect(error).to.have.property('meta');
          expect(error.meta).to.have.property('problems');
          const problems = error.meta.problems;
          expect(problems).to.be.an('array');
          expect(problems).to.deep.include('field pid is the wrong type');
          expect(problems).to.deep.include('field bibliographicRecordId is the wrong type');
          expect(problems).to.deep.include('field loans is the wrong type');
          expect(problems).to.deep.include('field workId is required');
          expect(problems).to.deep.include('field creator is required');
          expect(problems).to.deep.include('field title is required');
          expect(problems).to.deep.include('field titleFull is required');
          expect(problems).to.deep.include('field type is required');
          expect(problems).to.deep.include('field workType is required');
          expect(problems).to.deep.include('field language is required');
          expect(problems).to.deep.include('field items is required');
          expect(problems).to.deep.include('field libraries is required');
          expect(problems).to.deep.include('field pages is required');
          expect(problems).to.deep.include('field description is required');
          expect(problems).to.deep.include('field taxonomy_description is required');
        });
    });
    it('should complain about wrong bibliographic-record id', () => {
      const wrongId = require('fixtures/wrong-bibliographic-record-id-book.json');
      return expect(books.parsingMetaDataInjection(wrongId))
        .to.be.rejected
        .then(error => {
          expect(error).to.have.property('title');
          expect(error.title).to.match(/bibliographicrecordid cannot be converted to an integer/i);
        });
    });
    // it('should complain about wrong loans count', () => {
    //   const wrongId = require('fixtures/wrong-loans-book.json');
    //   return expect(books.parsingMetaDataInjection(wrongId))
    //     .to.be.rejected
    //     .then(error => {
    //       expect(error).to.have.property('title');
    //       expect(error.title).to.match(/loans cannot be converted to an integer/i);
    //     });
    // });
    it('should fill in all values from JSON', () => {
      return expect(books.parsingMetaDataInjection(blendstrup))
        .to.become({
          pid: 'already-seeded-pid-blendstrup-havelaagebogen',
          creator: 'Jens Blendstrup',
          title: 'Havelågebogen',
          title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
          language: 'Dansk',
          type: 'Bog',
          unit_id: 'unit:22125672',
          work_id: 'work:20137979',
          work_type: 'book',
          taxonomy_description: 'Fotografier af havelåger sat sammen med korte tekster, der fantaserer over, hvem der mon bor inde bag lågerne',
          description: 'Noget med låger',
          bibliographic_record_id: 53188931,
          items: 196,
          libraries: 80,
          pages: 645,
          loans: 1020,
          subject: 'billedværker, humor, fotografier',
          genre: 'humor',
          first_edition_year: 2017,
          literary_form: 'digte, fiktion',
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
            loans: 1020,
            pages: 645,
            pid: 'already-seeded-pid-blendstrup-havelaagebogen',
            title: 'Havelågebogen',
            title_full: 'Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger',
            type: 'Bog',
            unit_id: 'unit:22125672',
            work_id: 'work:20137979',
            taxonomy_description: 'Fotografier af havelåger sat sammen med korte tekster, der fantaserer over, hvem der mon bor inde bag lågerne',
            description: 'Noget med låger',
            work_type: 'book',
            subject: 'billedværker, humor, fotografier',
            genre: 'humor',
            first_edition_year: 2017,
            literary_form: 'digte, fiktion'
          });
        });
    });
  });
});
