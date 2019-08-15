'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const {asyncMiddleware} = require('__/async-express');
const _ = require('lodash');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const bookTable = constants.books.table;
const parameters = require('__/parameters');
const request = require('superagent');
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 60 * 60 * 4}); // Time to live is 4 hours
const {
  subjectsToTaxonomyDescription,
  fromTitle
} = require('../client/utils/taxonomy');
const {fetchAnonymousToken} = require('./smaug');

/* eslint-disable complexity */

const getWork = (
  pid,
  dcTitle,
  creator,
  creatorAut,
  abstract,
  extent,
  dcLanguage,
  date,
  identifierISBN,
  subjectDBCS,
  subjectDBCF,
  spatialDBCF,
  temporalDBCP,
  coverUrlFull
) => {
  // Tags merged and mapped with categories (parents/subjects)
  const tags =
    [
      ...(subjectDBCS || []),
      ...(subjectDBCF || []),
      ...(spatialDBCF || []),
      ...(temporalDBCP || [])
    ]
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(title => fromTitle(title))
      .filter(t => t) || [];

  return {
    book: {
      pid,
      title: (dcTitle && dcTitle[0]) || '',
      creator: (creatorAut && creatorAut[0]) || (creator && creator[0]) || '',
      creatorAut: (creatorAut && creatorAut[0]) || '',
      description: (abstract && abstract[0]) || '',
      identifierISBN: identifierISBN || '',
      pages: (extent && extent[0] && parseInt(extent[0], 10)) || '',
      language: (dcLanguage && dcLanguage[0]) || '',
      first_edition_year: (date && date[0]) || '',
      taxonomy_description_subjects:
        subjectsToTaxonomyDescription(subjectDBCS) || '',
      tags,
      coverUrl: (coverUrlFull && coverUrlFull[0]) || null
    }
  };
};

/* eslint-enable complexity */

/**
 * Will fetch a work from openplatform
 * The taxonomy_description from local db is included as well
 * @param {string} pid
 * @returns {object}
 */
const fetchWork = async pid => {
  let work = cache.get(pid);
  if (work) {
    return work;
  }

  const {
    dcTitle,
    creator,
    creatorAut,
    abstract,
    extent,
    dcLanguage,
    date,
    identifierISBN,
    subjectDBCS,
    subjectDBCF,
    spatialDBCF,
    temporalDBCP,
    coverUrlFull
  } = (await request.post(config.login.openplatformUrl + '/work').send({
    pids: [pid],
    fields: [
      'dcTitle',
      'creator',
      'creatorAut',
      'abstract',
      'extent',
      'dcLanguage',
      'date',
      'identifierISBN',
      'subjectDBCS',
      'subjectDBCF',
      'spatialDBCF',
      'temporalDBCP',
      'coverUrlFull'
    ],
    access_token: (await fetchAnonymousToken()).access_token
  })).body.data[0];

  /* map result */
  work = getWork(
    pid,
    dcTitle,
    creator,
    creatorAut,
    abstract,
    extent,
    dcLanguage,
    date,
    identifierISBN,
    subjectDBCS,
    subjectDBCF,
    spatialDBCF,
    temporalDBCP,
    coverUrlFull
  );

  /* include taxonomy_description */
  const workWithTaxonomyDescription = await knex(bookTable)
    .where('pid', pid)
    .select();
  if (workWithTaxonomyDescription.length > 0) {
    work.book.taxonomy_description =
      workWithTaxonomyDescription[0].taxonomy_description;
  }

  cache.set(pid, work);
  return work;
};

const fetchWorks = async pids => {
  const works = (await Promise.all(pids.map(pid => fetchWork(pid)))).filter(
    work =>
      !work.book.title.startsWith('Error: unknown/missing/inaccessible record')
  );
  const failed = _.difference(pids, works.map(b => b.book.pid));

  return {data: works, failed};
};

router
  .route('/')
  //
  // GET /v1/books
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const pids = parameters.parseList(req.query.pids);

      if (!pids || pids.length === 0) {
        return next({
          status: 400,
          title: 'PIDs expected',
          detail: 'You must supply at least one PID.'
        });
      }
      res.status(200).json(await fetchWorks(pids));
    })
  )
  .post(
    asyncMiddleware(async (req, res, next) => {
      const pids = parameters.parseList(req.body.pids);

      if (!pids || pids.length === 0) {
        return next({
          status: 400,
          title: 'PIDs expected',
          detail: 'You must supply at least one PID.'
        });
      }
      res.status(200).json(await fetchWorks(pids));
    })
  );

module.exports = router;
