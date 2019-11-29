'use strict';

const request = require('superagent');
const config = require('server/config');
const _ = require('lodash');

module.exports = {
  getPayedLibraries,
  userHasAPayingLibrary
};

async function getPayedLibraries() {
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
  } catch (e) {
    return parseException(e);
  }
}

async function userHasAPayingLibrary(user) {
  const libraryList = await getPayedLibraries();

  console.log('######## libraryList', libraryList);
}
