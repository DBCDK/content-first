'use strict';

const assert = require('assert');
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

function get(id, user = {}) {
  return community.getObjectById(id, user);
}

function put(object, user) {
  assert(user);
  return community.putObject({object, user});
}

function find(query, user = {}) {
  return community.findObjects(query, user);
}

module.exports = {getUser, get, put, find};
