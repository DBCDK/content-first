'use strict';

const {gettingUser, gettingUserIdFromLoginToken} = require('server/user');

function gettingUserFromToken (req) {
  return new Promise(async (resolve, reject) => {
    const location = req.baseUrl;
    const loginToken = req.cookies['login-token'];
    if (!loginToken) {
      return reject({
        status: 403,
        title: 'User not logged in',
        detail: 'Missing login-token cookie',
        meta: {resource: location}
      });
    }
    let userId;
    try {
      userId = await gettingUserIdFromLoginToken(loginToken);
    }
    catch (error) {
      if (error.status === 404) {
        return reject({
          status: 403,
          title: 'User not logged in',
          detail: `Unknown login token ${loginToken}`,
          meta: {resource: location}
        });
      }
      return reject({
        status: 403,
        title: 'User not logged in',
        detail: `Login token ${loginToken} has expired`,
        meta: {resource: location}
      });
    }
    try {
      const user = await gettingUser(userId);
      return resolve(user);
    }
    catch (error) {
      Object.assign(error, {
        meta: {resource: location}
      });
      return reject(error);
    }
  });
}

module.exports = {
  gettingUserFromToken
};
