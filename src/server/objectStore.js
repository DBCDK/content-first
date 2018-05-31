'use strict';

const assert = require('assert');
const community = require('server/community');

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;

async function getUser(req) {
  const loginToken = req.cookies['login-token'];
  if (loginToken) {
    let result = await knex(cookieTable)
      .where('cookie', loginToken)
      .select();
    if (result.length === 1) {
      return {
        id: result[0].community_profile_id,
        openplatformId: result[0].openplatform_id,
        admin: false
      };
    }
  }
  // return undefined as user, if not logged in.
  return;
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
