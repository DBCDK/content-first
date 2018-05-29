'use strict';

const community = require('server/community');
const {findingUserIdTroughLoginToken} = require('server/user');

async function getUser(req) {
  try {
    const userId = await findingUserIdTroughLoginToken(req);
    const user = await community.gettingUserByProfileId(userId);
    // TODO admin
    return {id: userId, openplatformId: user.openplatformId, admin: false};
  } catch (e) {
    return;
  }
}

module.exports = {getUser};
