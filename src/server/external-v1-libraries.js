'use strict';

const request = require('superagent');
const config = require('server/config');
const logger = require('server/logger');
const NodeCache = require('node-cache');
const _ = require('lodash');

const oneHourCache = new NodeCache({stdTTL: 60 * 60}); // Time to live is 1 hour
const oneDayCache = new NodeCache({stdTTL: 60 * 60 * 24}); // Time to live is 1 day

const cache_payingLibraries = 'payingLibraries';
const cache_lookupUrl = 'lookupUrl';

module.exports = {
  getPayingLibraries,
  getUserLibrary,
  userHasAPayingLibrary,
  getLibraryLookupUrl
};

// Fetch list with paying libraries form Forsrights
async function getPayingLibraries() {
  const requestUrl = config.fors.url;

  const requestObject = {
    action: 'libraryListFromServiceName',
    serviceName: 'laesekompas-premium',
    outputType: 'json'
  };

  try {
    const res = (await request.get(requestUrl).query(requestObject)).body;

    // Select libraries from response
    const list = _.get(
      res,
      'libraryListFromServiceNameResponse.navisionCustomers[0].customer'
    );

    // Return libraries as list ['lib', 'lib',  ...]
    return list.map(l => l.$);
  } catch (error) {
    logger.log.error(error);
    throw error;
  }
}

// Not in use ---v
async function getUserLibrary(openplatformToken) {
  const openplatformUrl = config.login.openplatformUrl;

  try {
    const userResponse = await request
      .post(openplatformUrl + '/user')
      .send({access_token: openplatformToken});

    const user = _.get(userResponse, 'body.data', '');

    const librariesResponse = await request
      .post(openplatformUrl + '/libraries')
      .send({
        agencyIds: [user.agency],
        fields: ['agencyName'],
        access_token: openplatformToken
      });

    return {
      agencyId: user.agency,
      agencyName: _.get(librariesResponse, 'body.data[0].agencyName', '')
    };
  } catch (error) {
    logger.log.error(error);
    throw error;
  }
}

/**
 *
 * Get library lookupUrl
 *
 */

async function getLibraryLookupUrl(agency, openplatformToken) {
  const openplatformUrl = config.login.openplatformUrl;
  let lookupUrl = oneDayCache.get(cache_lookupUrl);

  // If cached, just return
  if (lookupUrl) {
    return lookupUrl;
  }

  try {
    const response = await request.get(openplatformUrl + '/libraries').send({
      agencyIds: [agency],
      fields: ['lookupUrl'],
      access_token: openplatformToken
    });

    lookupUrl = _.get(response, 'body.data[0].lookupUrl', null);

    oneDayCache.set(cache_lookupUrl, lookupUrl);

    return lookupUrl;
  } catch (error) {
    logger.log.error(error);
    throw error;
  }
}

/**
 *
 * Check if loggedIn user has a paying library
 *
 */

async function userHasAPayingLibrary(agencyId) {
  let libraryList = oneHourCache.get(cache_payingLibraries);

  if (!libraryList) {
    // Get list from paying libraries (forsrights)
    libraryList = await getPayingLibraries();
    oneHourCache.set(cache_payingLibraries, libraryList);
  }

  // check user permissions (premium functionality)
  return !!libraryList.includes(agencyId);
}
