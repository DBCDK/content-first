'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const {asyncMiddleware} = require('__/async-express');
const config = require('server/config');
const request = require('superagent');
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 60 * 60 * 24}); // Time to live is 24 hours
const {fetchAnonymousToken} = require('./smaug');
const {get, orderBy, uniqBy} = require('lodash');

/**
 * Returns part number
 * @param {Array<string>} titleSeriesArr
 * @returns {Number}
 */
const getPartFromTitleSeries = titleSeriesArr => {
  if (!titleSeriesArr || !titleSeriesArr.length) {
    return '?';
  }
  for (let i = 0; i < titleSeriesArr.length; i++) {
    const split = titleSeriesArr[i].split(';');
    if (split.length > 1) {
      return parseInt(split[1].replace(/\D/g, ''));
    }
  }
  return '?';
};

/**
 * Fetches the name of the series and collection details
 * collectionDetails contains volumes of the work
 * @param pid
 * @returns {Promise}
 */
const fetchInitial = async pid => {
  let res = cache.get(pid);
  if (res) {
    return res;
  }
  const response = (await request
    .post(config.login.openplatformUrl + '/work')
    .send({
      pids: [pid],
      fields: ['titleSeries', 'collectionDetails'],
      access_token: (await fetchAnonymousToken()).access_token
    })).body.data[0];

  const titleSeries = get(response, 'titleSeries[0]', '')
    .split(';')[0]
    .trim();

  const bindIdRegex = /bind (\d+)/i;
  let multiVolume = response.collectionDetails
    .map(volume => {
      const bindIdMatch = bindIdRegex.exec(volume.type[0]);
      return {
        pid: volume.pid[0],
        title: volume.title[0],
        type: volume.type[0],
        part: bindIdMatch && bindIdMatch[1] && parseInt(bindIdMatch[1])
      };
    })
    .filter(volume => !!volume.part);
  multiVolume = uniqBy(multiVolume, 'part');
  multiVolume = orderBy(multiVolume, 'part', 'asc');

  res = {
    titleSeries,
    multiVolume
  };

  cache.set(pid, res);
  return res;
};

/**
 * Search for works part of the series
 * @param {string} titleSeries
 * @returns {Promise}
 */
const fetchSeriesData = async titleSeries => {
  let res = cache.get(titleSeries);
  if (res) {
    return res;
  }
  let response = (await request
    .post(config.login.openplatformUrl + '/search')
    .send({
      fields: ['pid', 'title', 'type', 'date', 'titleSeries'],
      q: `phrase.titleSeries="${titleSeries}"`,
      limit: 50,
      sort: 'solr_numberInSeries_ascending',
      access_token: (await fetchAnonymousToken()).access_token
    })).body.data
    .map(entry => ({
      pid: entry.pid[0],
      title: entry.title[0],
      type: entry.type[0],
      date: entry.date[0],
      titleSeries: entry.titleSeries,
      part: getPartFromTitleSeries(entry.titleSeries)
    }))
    .filter(entry => entry.pid.startsWith('870970-basis'));
  response = orderBy(response, ['date', 'part'], ['asc', 'asc']);

  cache.set(titleSeries, response);
  return response;
};

/**
 * Returns the series the pid is part of.
 *
 * A series in content first is based on either:
 * - a series (ex. 870970-basis:52398681)
 * - a multi volume (ex. 870970-basis:29433909)
 * - a part in a series may be a multi volume itself (ex. 870970-basis:04462580)
 *
 * @param pid
 * @returns {Promise}
 */
const fetchSeries = async pid => {
  const {titleSeries, multiVolume} = await fetchInitial(pid);

  if (titleSeries) {
    const series = await fetchSeriesData(titleSeries);

    if (series.length > 1) {
      series.forEach(entry => cache.set(entry.pid, {titleSeries}));

      return {
        isSeries: true,
        isMultiVolumeSeries: false,
        titleSeries,
        data: series
      };
    }
  }

  if (multiVolume.length > 1) {
    multiVolume.forEach(entry =>
      cache.set(entry.pid, {titleSeries, multiVolume})
    );
    return {
      isSeries: false,
      isMultiVolumeSeries: true,
      titleSeries,
      data: multiVolume
    };
  }

  return {isSeries: false, isMultiVolumeSeries: false, data: []};
};

router
  .route('/:pid')
  //
  // GET /v1/series
  //
  .get(
    asyncMiddleware(async (req, res) => {
      res.status(200).json(await fetchSeries(req.params.pid));
    })
  );

module.exports = router;
