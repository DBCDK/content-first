/* eslint-env mocha */
'use strict';

const mock = require('fixtures/mock-server');
const nock = require('nock');
const {expect} = require('chai');
const request = require('supertest');
const {expectFailure} = require('fixtures/output-verifiers');
const config = require('server/config');

const mockResponse = {
  responseHeader: {
    'ab-id': '1',
    build: 'not available',
    time: 1,
    recommender: 'content-first',
    timings: {total: 0.695},
    git: 'not available',
    version: 'devel',
    tags: {},
    numFound: 10
  },
  response: [
    {
      pid: '870970-basis:51861213',
      value: 6,
      title: 'Americanah : roman',
      creator: 'Chimamanda Ngozi Adichie'
    },
    {
      pid: '870970-basis:29418047',
      value: 5,
      title: 'Mrs. Dalloway : roman (Ved Jørgen Christian Hansen)',
      creator: 'Virginia Woolf'
    },
    {
      pid: '870970-basis:06124283',
      value: 5,
      title: 'Morgengaven : roman',
      creator: 'Dea Trier Mørch'
    },
    {
      pid: '870970-basis:53868975',
      value: 5,
      title: 'Den, der lever stille : roman (Klassesæt)',
      creator: 'Leonora Christina Skov'
    },
    {
      pid: '870970-basis:52793793',
      value: 5,
      title: 'Isfald : roman',
      creator: 'Liselotte Michelsen'
    },
    {
      pid: '870970-basis:53562590',
      value: 4,
      title: 'De voksnes rækker',
      creator: 'Anna Grue'
    },
    {
      pid: '870970-basis:51960270',
      value: 4,
      title: 'Min ukendte bror : roman',
      creator: 'Niels Lyngsø'
    },
    {
      pid: '870970-basis:25186729',
      value: 4,
      title: 'Børn af zonen',
      creator: 'Jana Hensel'
    },
    {
      pid: '870970-basis:51869257',
      value: 4,
      title: 'Nike : poesi',
      creator: 'Caspar Eric (f. 1987)'
    },
    {
      pid: '870970-basis:51943643',
      value: 4,
      title: 'Kvinden i toget : thriller',
      creator: 'Paula Hawkins'
    }
  ]
};

describe('Endpoint /v1/recommendations', () => {
  const webapp = request(mock.external);

  describe('GET /v1/recompass?recommender=recompasTags&tags=...', () => {
    it('should handle no tags', () => {
      const url = '/v1/recompass?recommender=recompasTags&tags=';
      return webapp
        .get(url)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/tags expected/i);
            expect(error).to.have.property('detail');
            expect(error.detail).to.match(/supply at least one tag/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('resource');
          });
        })
        .expect(400);
    });

    it('should return a list of books that include all specified tags', () => {
      nock(config.recompass.url.tags)
        .post('')
        .reply(200, mockResponse);
      nock(config.recompass.url.work)
        .post('')
        .reply(200, mockResponse);
      //
      const url = `/v1/recompass?recommender=recompasTags&tags=5329&tags=3510&tags=5734&tags=5731&tags=5280`;
      return webapp
        .get(url)
        .expect(res => {
          expect(res.body).to.deep.equal(mockResponse);
        })
        .expect(200);
    });
  });
});
