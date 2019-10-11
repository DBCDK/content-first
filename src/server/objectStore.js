'use strict';
var fs = require('fs');
const logger = require('server/logger');
const assert = require('assert');
const _ = require('lodash');
const config = require('server/config');
const request = require('superagent');
const smaug = require('./smaug');

const rootType = 'bf130fb7-8bd4-44fd-ad1d-43b6020ad102';
let storageUrl;
let aggregationUrl;
let typeId;
let validated = false;

function trimEpoch(timestamp) {
  return Number(timestamp.toString().slice(0, 10));
}

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
};

const fetchAnonymousToken = !config.server.isProduction
  ? () => ({
      access_token: 'anon_token'
    })
  : smaug.fetchAnonymousToken;

/**
 * Will setup the storage with either creating or reusing
 * the content-first type
 */
async function initDevStore() {
  try {
    await request.post(config.storage.url).send({
      access_token: fetchAnonymousToken().access_token,
      get: {_id: rootType}
    });

    const file = 'storage_type_id.env';
    let cfTypeId;
    try {
      const contents = fs.readFileSync(file, 'utf8');
      await request.post(config.storage.url).send({
        access_token: fetchAnonymousToken().access_token,
        get: {_id: contents}
      });
      cfTypeId = contents;
      logger.log.info('Initializing dev storage: Using existing cf-type', {
        cfTypeId,
        storageUrl: config.storage.url
      });
    } catch (readError) {
      cfTypeId = (await request.get(
        'http://localhost:3000/v1/test/initStorage'
      )).text;
      fs.writeFileSync(file, cfTypeId);
      logger.log.info('Initializing dev storage: Creating new cf-type', {
        cfTypeId
      });
    }
    setupObjectStore({typeId: cfTypeId, url: config.storage.url});
  } catch (e) {
    logger.log.info(
      'Initializing dev storage: Storage not ready, waiting 2000ms',
      {e}
    );
    await sleep(2000);
    initDevStore();
  }
}

if (!config.server.isProduction) {
  initDevStore();
}

function setupObjectStore(storageOptions) {
  if (config.server.isProduction && !storageOptions.typeId) {
    throw new Error('storageOptions.typeId is not valid');
  }
  if (!storageOptions.url) {
    throw new Error('storageOptions.url is not valid');
  }
  storageUrl = storageOptions.url;
  aggregationUrl = storageOptions.url.replace(/storage\/?$/, 'aggregation');
  console.log({storageUrl, aggregationUrl});
  typeId = storageOptions.typeId;
  validated = false;
}

async function validateObjectStore() {
  if (validated) {
    return;
  }
  if (!storageUrl || !typeId) {
    throw new Error('Object store has not been setup');
  }
  try {
    const access_token = (await fetchAnonymousToken()).access_token;
    const data = (await request
      .post(storageUrl)
      .send({access_token, get: {_id: typeId}})).body.data;
    logger.log.info('Object storage validated', {
      typeId,
      data
    });
    validated = true;
  } catch (e) {
    throw new Error(
      `Object storage validation failed, typeId=${typeId}, storageUrl=${storageUrl}`
    );
  }
}

function getUser(req) {
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

const toStorageObject = object => {
  // handle created/modified - this should be handled in the serviceprovider...
  if (!object._id) {
    object._created = Math.round(Date.now() / 1000);
    object._modified = object._created;
  } else {
    object._modified = Math.round(Date.now() / 1000);

    // Just in case the client has set it to a 13 digit epoch
    if (!object._created) {
      object._created = Math.round(Date.now() / 1000);
    } else {
      object._created = trimEpoch(object._created);
    }
  }

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

  copy._created = Math.floor(Date.parse(storageObject._created) / 1000);
  copy._modified = Math.floor(Date.parse(storageObject._version) / 1000);

  return copy;
};

async function get({id}, user = {}, role) {
  await validateObjectStore();
  let access_token =
    user.openplatformToken || (await fetchAnonymousToken()).access_token;
  const requestObject = {access_token, get: {_id: id}, role};

  try {
    const data = (await request.post(storageUrl).send(requestObject)).body.data;
    const o = fromStorageObject(data);

    return {data: _.omit(o, ['_version', '_client'])};
  } catch (e) {
    return parseException(e);
  }
}

async function put(object, user, role) {
  assert(user);
  assert(user.openplatformToken);
  await validateObjectStore();

  const requestObject = {
    access_token: user.openplatformToken,
    put: toStorageObject(object),
    role
  };
  try {
    const data = (await request.post(storageUrl).send(requestObject)).body.data;
    return {data: {_id: data._id, _rev: data._version}};
  } catch (e) {
    return parseException(e);
  }
}

async function find(query, user = {}, role) {
  await validateObjectStore();
  let access_token =
    user.openplatformToken || (await fetchAnonymousToken()).access_token;
  const requestObject = {
    access_token,
    scan: {
      _type: typeId,
      index: [],
      startsWith: [],
      limit: query.limit || 20,
      reverse: true,
      expand: true
    },
    role
  };
  if (typeof query.owner !== 'undefined') {
    requestObject.scan.index.push('_owner');
    requestObject.scan.startsWith.push(query.owner);
  }
  if (typeof query.type !== 'undefined') {
    requestObject.scan.index.push('cf_type');
    requestObject.scan.startsWith.push(query.type);
  }
  if (query.key) {
    requestObject.scan.index.push('cf_key');
    requestObject.scan.startsWith.push(query.key);
  }
  requestObject.scan.index.push('_created');
  try {
    const objects = (await request
      .post(storageUrl)
      .send(requestObject)).body.data.map(res =>
      _.omit(fromStorageObject(res), ['_version', '_client'])
    );
    return {data: objects};
  } catch (e) {
    return parseException(e);
  }
}

/*
 * Delete all content-first objects belonging to a user
 * This is not optimized for speed
 */
async function deleteUser({openplatformToken, openplatformId, role}) {
  try {
    // all object ids owned by user
    const ids = (await request.post(storageUrl).send({
      access_token: openplatformToken,
      find: {_type: '*', _owner: openplatformId}
    })).body.data;

    // Delete only those that are content-first objects
    for (let i = 0; i < ids.length; i++) {
      const data = (await request
        .post(storageUrl)
        .send({access_token: openplatformToken, get: {_id: ids[i]}, role})).body
        .data;
      if (data._type === typeId) {
        await request.post(storageUrl).send({
          access_token: openplatformToken,
          delete: {_id: data._id}
        });
      }
    }
  } catch (e) {
    return parseException(e);
  }
}

async function del({id}, user, role) {
  assert(user);
  assert(user.openplatformToken);
  await validateObjectStore();

  const requestObject = {
    access_token: user.openplatformToken,
    delete: {_id: id},
    role
  };

  try {
    await request.post(storageUrl).send(requestObject);
    return {
      data: {ok: true}
    };
  } catch (e) {
    return parseException(e);
  }
}

async function aggregation({
  type,
  sort = 'num_items',
  pid,
  limit = 20,
  offset = 0
}) {
  await validateObjectStore();

  let access_token = (await fetchAnonymousToken()).access_token;
  const requestObject = {
    access_token,
    aggregationType: type,
    type: typeId,
    limit,
    offset,
    sort,
    pid
  };

  const res = (await request.post(aggregationUrl).send(requestObject)).body.data
    .map(o => fromStorageObject(o))
    .map(o => ({
      _type: o._type,
      _id: o._id,
      _public: true,
      title: o.list_title,
      description: o.list_description,
      image: o.list_image,
      owner: {
        _id: o._owner,
        name: o.owner_name,
        image: o.owner_image
      },
      _created: o._created,
      _modified: o._modified,
      num_follows: o.num_follows,
      num_items: o.num_items,
      num_comments: o.num_comments,
      items: o.pids
    }));
  return {
    data: res
  };
}

async function getRoles(user) {
  await validateObjectStore();

  if (!user) {
    return {
      data: []
    };
  }

  const requestObject = {
    access_token: user.openplatformToken,
    get_roles: {}
  };

  try {
    const res = (await request
      .post(storageUrl)
      .send(requestObject)).body.data.map(role => fromStorageObject(role));
    return {
      data: res
    };
  } catch (e) {
    return parseException(e);
  }
}

async function getAllRoles() {
  await validateObjectStore();
  const requestObject = {
    access_token: (await fetchAnonymousToken()).access_token,
    scan: {
      _type: rootType,
      index: ['_owner', 'name'],
      startsWith: ['cf-admin', 'role'],
      expand: true
    }
  };

  try {
    const res = (await request
      .post(storageUrl)
      .send(requestObject)).body.data.map(role => fromStorageObject(role));
    return {
      data: res
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
  getAllRoles,
  getRoles,
  aggregation,
  getUser,
  get,
  put,
  find,
  del,
  deleteUser,
  setupObjectStore
};
