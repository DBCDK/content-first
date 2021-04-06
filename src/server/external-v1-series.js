'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const {asyncMiddleware} = require('__/async-express');
const config = require('server/config');
const request = require('superagent');
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 60 * 60 * 24}); // Time to live is 24 hours
const {fetchAnonymousToken} = require('./smaug');
const {orderBy, uniqBy} = require('lodash');

const bindIdRegex = /bind (\d+)/i;

const parseTitleSeries = titleSeries => {
  if (titleSeries && titleSeries.length) {
    for (let i = 0; i < titleSeries.length; i++) {
      const split = titleSeries[i].split(';');
      if (split.length > 1) {
        return {
          isSeries: true,
          titleSeries: split[0].trim(),
          part: parseInt(split[1].replace(/\D/g, ''), 10)
        };
      }
    }
  }
  return {isSeries: false};
};

const parseCollectionDetails = collectionDetails => {
  if (!collectionDetails) {
    return [];
  }
  let multiVolume = collectionDetails
    .map(volume => {
      return {
        pid: volume.pid[0],
        title: volume.title[0],
        type: volume.type[0],
        part: getPartFromType(volume.type)
      };
    })
    .filter(
      volume =>
        !!volume.part &&
        volume.pid.startsWith('870970-basis') &&
        volume.part !== '?'
    );
  multiVolume = uniqBy(multiVolume, 'part');
  multiVolume = orderBy(multiVolume, 'part', 'asc');
  return multiVolume;
};

/**
 * Returns part number
 * @param {Array<string>} titleSeriesArr
 * @returns {Number}
 */
const getPartFromType = typeArr => {
  if (!typeArr || !typeArr.length) {
    return '?';
  }
  for (let i = 0; i < typeArr.length; i++) {
    const bindIdMatch = bindIdRegex.exec(typeArr[i]);
    if (!typeArr[i].includes('stor skrift') && bindIdMatch && bindIdMatch[1]) {
      return parseInt(bindIdMatch[1], 10);
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
const fetchInitial = async (pid, debugObj) => {
  let res = cache.get(pid);
  if (res && !debugObj) {
    return res;
  }
  const response = (
    await request.post(config.login.openplatformUrl + '/work').send({
      pids: [pid],
      fields: ['titleSeries', 'collectionDetails', 'type'],
      access_token: (await fetchAnonymousToken()).access_token
    })
  ).body.data[0];
  if (debugObj) {
    debugObj.workResponse = response;
  }

  let multiVolume = parseCollectionDetails(response.collectionDetails);

  res = {...parseTitleSeries(response.titleSeries), multiVolume};

  cache.set(pid, res);
  return res;
};

/**
 * Search for works part of the series
 * @param {string} titleSeries
 * @returns {Promise}
 */
const fetchSeriesData = async (titleSeries, debugObj) => {
  let res = cache.get(titleSeries);
  if (res && !debugObj) {
    return res;
  }
  let response = (
    await request.post(config.login.openplatformUrl + '/search').send({
      fields: [
        'pid',
        'title',
        'type',
        'date',
        'titleSeries',
        'language',
        'identifierURI',
        'collectionDetails'
      ],
      q: `phrase.titleSeries="${titleSeries}"`,
      limit: 50,
      sort: 'solr_numberInSeries_ascending',
      access_token: (await fetchAnonymousToken()).access_token
    })
  ).body.data;
  if (debugObj) {
    debugObj.seriesResponse = response;
  }

  response = response.map(entry => ({
    pid: entry.pid[0],
    title: entry.title[0],
    type: entry.type[0],
    date: entry.date[0],
    titleSeries: entry.titleSeries,
    language: entry.language,
    part: parseTitleSeries(entry.titleSeries).part,
    identifierURI: entry.identifierURI,
    collectionDetails: entry.collectionDetails
  }));
  response = orderBy(response, ['part', 'date'], ['asc', 'asc']);

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
const fetchSeries = async (pid, debug) => {
  const debugObj = debug ? {} : null;
  const {isSeries, titleSeries, multiVolume} = await fetchInitial(
    pid,
    debugObj
  );

  if (isSeries) {
    let series = await fetchSeriesData(titleSeries, debugObj);

    if (series.length > 0) {
      series.forEach(entry =>
        cache.set(entry.pid, {isSeries, titleSeries, multiVolume})
      );

      const expandedSeries = [];

      series = series.forEach(parent => {
        const multi = parseCollectionDetails(parent.collectionDetails);
        delete parent.collectionDetails;
        if (multi.length > 1) {
          let extent = 0;
          multi.forEach(volume => {
            if (volume.part > extent) {
              extent = volume.part;
            }
          });
          multi.forEach(volume => {
            expandedSeries.push({
              ...parent,
              ...volume,
              volumeExtent: extent,
              volumeId: volume.part,
              part: parent.part
            });
          });
        } else {
          expandedSeries.push(parent);
        }
      });

      return {
        isSeries: true,
        isMultiVolumeSeries: false,
        titleSeries,
        data: expandedSeries,
        debug: debug && debugObj
      };
    }
    if (multiVolume.length > 0) {
      multiVolume.forEach(entry =>
        cache.set(entry.pid, {isSeries, titleSeries, multiVolume})
      );
      return {
        isSeries: true,
        isMultiVolumeSeries: true,
        titleSeries,
        data: multiVolume,
        debug: debug && debugObj
      };
    }
  }

  return {
    isSeries: false,
    isMultiVolumeSeries: false,
    data: [],
    debug: debug && debugObj
  };
};

router
  .route('/:pid')
  //
  // GET /v1/series
  //
  .get(
    asyncMiddleware(async (req, res) => {
      res.status(200).json(await fetchSeries(req.params.pid, req.query.debug));
    })
  );

module.exports = {router, parseTitleSeries};
