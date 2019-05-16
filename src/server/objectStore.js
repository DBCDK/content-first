'use strict';

const assert = require('assert');
const _ = require('lodash');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const objectTable = constants.objects.table;
const uuidGenerator = require('uuid');
const request = require('superagent');

const serviceProviderUrl = 'http://localhost:8080/v3/storage'; // TODO use from config
let typeId; // TODO should be set in config

// TODO should be located elsewhere
const fetchToken = async () => {
  return (await request
    .post(config.auth.url + '/oauth/token')
    .auth(config.auth.id, config.auth.secret)
    .send('grant_type=password&username=@&password=@')).body.access_token;
};

function setTypeId(id) {
  // console.log('setting type id', id);
  typeId = id;
}

async function getUser(req) {
  if (req.isAuthenticated()) {
    const user = req.user;
    if (user.expires < Date.now() / 1000) {
      return;
    }
    return {id: -1, admin: false, ...user};
  }
  // return undefined as user, if not logged in.
  return;
}

const rowToObject = o => ({
  ...o.data,
  _id: o.id,
  _rev: o.rev,
  _owner: o.owner,
  _type: o.type,
  _key: o.key,
  _public: o.public,
  _created: o.created,
  _modified: o.modified
});

async function get(id, user = {}) {
  let access_token = user.openplatformToken || (await fetchToken());
  const requestObject = {access_token, get: {_id: id}};

  try {
    const data = (await request.post(serviceProviderUrl).send(requestObject))
      .body.data;
    const o = fromStorageObject(data);

    return {data: _.omit(o, ['_version', '_client'])};
  } catch (e) {
    return parseException(e);
  }
}

const toStorageObject = object => {
  const copy = {};

  Object.entries(object).forEach(([key, value]) => {
    if (key === '_rev') {
      copy._version = value;
    } else if (key === '_public') {
      copy.public = value;
    } else if (key.startsWith('_') && key !== '_id') {
      copy[`cf${key}`] = value;
    } else {
      copy[key] = value;
    }
  });
  copy.cf_key = copy.cf_key || '';
  copy._type = typeId; // the special content-first object type
  return copy;
};
const fromStorageObject = storageObject => {
  const copy = {};

  Object.entries(storageObject).forEach(([key, value]) => {
    if (key === '_type') {
      return;
    }
    if (key === 'public') {
      copy._public = value;
    } else if (key === '_version') {
      copy._rev = value;
    } else if (key.startsWith('cf_')) {
      copy[key.substr(2)] = value;
    } else {
      copy[key] = value;
    }
  });
  return copy;
};

async function put(object, user) {
  assert(user);
  assert(user.openplatformId);
  assert(user.openplatformToken);

  const requestObject = {
    access_token: user.openplatformToken,
    put: toStorageObject(object)
  };
  try {
    const data = (await request.post(serviceProviderUrl).send(requestObject))
      .body.data;
    return {data: {_id: data._id, _rev: data._version}};
  } catch (e) {
    return parseException(e);
  }
}

async function find(query, user = {}) {
  let access_token = user.openplatformToken || (await fetchToken());
  const requestObject = {access_token, find: {_type: typeId}};
  if (typeof query.type !== 'undefined') {
    requestObject.find.cf_type = query.type;
  }
  if (typeof query.owner !== 'undefined') {
    requestObject.find._owner = query.owner;
  }

  try {
    const ids = (await request.post(serviceProviderUrl).send(requestObject))
      .body.data;

    const objects = (await Promise.all(
      ids.map(_id =>
        request.post(serviceProviderUrl).send({access_token, get: {_id}})
      )
    )).map(res =>
      _.omit(fromStorageObject(res.body.data), ['_version', '_client'])
    );
    return {data: objects};
  } catch (e) {
    return parseException(e);
  }

  query = Object.assign(
    {
      limit: 20,
      offset: 0
    },
    query
  );

  if (!query.type) {
    throw new Error('Query Error');
  }
  let knexQuery = knex(objectTable);

  if (typeof query.type !== 'undefined') {
    knexQuery = knexQuery.where('type', query.type);
  }
  if (typeof query.key !== 'undefined') {
    knexQuery = knexQuery.where('key', query.key);
  }
  if (typeof query.owner !== 'undefined') {
    knexQuery = knexQuery.where('owner', query.owner);
  }
  if (!query.owner || query.owner !== user.openplatformId) {
    knexQuery = knexQuery.where('public', true);
  }

  let result = await knexQuery
    .orderBy('type')
    .orderBy('key')
    .orderBy('modified', 'desc')
    .limit(query.limit)
    .offset(query.offset)
    .select();
  result = result.map(rowToObject);

  return {data: result};
}

async function updateOwner(oldOwner, newOwner) {
  if (!oldOwner) {
    throw new Error('oldOwner missing');
  }
  if (!newOwner) {
    throw new Error('newOwner missing');
  }

  const res = await knex(objectTable)
    .update('owner', newOwner)
    .where('owner', oldOwner);

  return res;
}

async function del(id, user) {
  assert(user);
  assert(user.openplatformId);
  assert(user.openplatformToken);

  const requestObject = {
    access_token: user.openplatformToken,
    delete: {_id: id}
  };

  try {
    await request.post(serviceProviderUrl).send(requestObject);
    return {
      data: {ok: true}
    };
  } catch (e) {
    return parseException(e);
  }
}
function parseException(e) {
  if (e.status === 404) {
    return {
      data: {error: 'not found'},
      errors: [{status: 404, message: 'not found'}]
    };
  }
  if (e.status === 403) {
    return {
      data: {error: 'forbidden'},
      errors: [{status: 403, message: 'forbidden'}]
    };
  }
  if (e.status === 409) {
    return {
      data: {error: 'conflict'},
      errors: [{status: 409, message: 'conflict'}]
    };
  }
  return {
    data: {error: 'internal server error'},
    errors: [{status: 500, message: 'internal server error'}]
  };
}

module.exports = {
  getUser,
  get,
  put,
  find,
  del,
  updateOwner,
  setTypeId
};
