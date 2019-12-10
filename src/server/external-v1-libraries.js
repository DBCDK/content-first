'use strict';

const request = require('superagent');
const config = require('server/config');
const logger = require('server/logger');
const _ = require('lodash');

module.exports = {
  getPayingLibraries,
  getUserLibrary,
  userHasAPayingLibrary
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

  Check if loggedIn user has a paying library

*/

async function userHasAPayingLibrary(agencyId) {
  // Get list from paying libraries (forsrights)
  const libraryList = await getPayingLibraries();

  // Get loggedInUser's library (agencyId)
  // const agency = await getUserLibrary(user.openplatformToken);

  // check user permissions (premium functionality)
  return !!libraryList.includes(agencyId);
}
