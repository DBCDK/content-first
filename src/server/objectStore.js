'use strict';
const logger = require('server/logger');
const assert = require('assert');
const _ = require('lodash');
const config = require('server/config');
const request = require('superagent');
const smaug = require('./smaug');

let storageUrl;
let typeId;
let validated = false;

const fetchAnonymousToken = !config.server.isProduction
  ? () => ({
      access_token: 'anon_token'
    })
  : smaug.fetchAnonymousToken;

function setupObjectStore(storageOptions) {
  if (config.server.isProduction && !storageOptions.typeId) {
    throw new Error('storageOptions.typeId is not valid');
  }
  if (!storageOptions.url) {
    throw new Error('storageOptions.url is not valid');
  }
  storageUrl = storageOptions.url;
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

async function get(id, user = {}) {
  await validateObjectStore();
  let access_token =
    user.openplatformToken || (await fetchAnonymousToken()).access_token;
  const requestObject = {access_token, get: {_id: id}};

  try {
    const data = (await request.post(storageUrl).send(requestObject)).body.data;
    const o = fromStorageObject(data);

    return {data: _.omit(o, ['_version', '_client'])};
  } catch (e) {
    return parseException(e);
  }
}

async function put(object, user) {
  assert(user);
  assert(user.openplatformToken);
  await validateObjectStore();

  const requestObject = {
    access_token: user.openplatformToken,
    put: toStorageObject(object)
  };
  try {
    const data = (await request.post(storageUrl).send(requestObject)).body.data;
    return {data: {_id: data._id, _rev: data._version}};
  } catch (e) {
    return parseException(e);
  }
}

async function find(query, user = {}) {
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
      reverse: true
    }
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
  requestObject.scan.index.push('cf_created');
  try {
    const ids = (await request.post(storageUrl).send(requestObject)).body.data;

    const objects = (await Promise.all(
      ids.map(entry =>
        request.post(storageUrl).send({access_token, get: {_id: entry.val}})
      )
    )).map(res =>
      _.omit(fromStorageObject(res.body.data), ['_version', '_client'])
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
async function deleteUser({openplatformToken, openplatformId}) {
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
        .send({access_token: openplatformToken, get: {_id: ids[i]}})).body.data;
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

async function del(id, user) {
  assert(user);
  assert(user.openplatformToken);
  await validateObjectStore();

  const requestObject = {
    access_token: user.openplatformToken,
    delete: {_id: id}
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

async function aggregation({type, sort = 'num_items', pid}) {
  await validateObjectStore();

  const SORT_OPTIONS = {
    num_items: 'num_items',
    num_follows: 'num_follows',
    num_comments: 'num_comments',
    created: '_created',
    modified: '_modified'
  };

  if (!type) {
    return {
      data: [],
      errors: [{status: 400, message: "Missing query param: 'type'"}]
    };
  }

  if (type !== 'list') {
    return {
      data: [],
      errors: [
        {status: 400, message: "Unsupported type. Supported types: 'list'"}
      ]
    };
  }
  if (!SORT_OPTIONS[sort]) {
    return {
      data: [],
      errors: [
        {
          status: 400,
          message: `Unsupported sort. Supported sort: ${Object.keys(
            SORT_OPTIONS
          ).join(', ')}`
        }
      ]
    };
  }
  if (pid) {
    return [
      {
        _type: 'list',
        _id: 'list-3',
        _public: true,
        title: 'liste3',
        description: "Indeholder alle pid'er",
        image: null,
        owner: {
          _id: 'owner-2',
          name: 'owner2',
          image: null
        },
        _created: 3000,
        _modified: 4000,
        num_follows: 400,
        num_items: 50,
        num_comments: 2
      }
    ];
  }

  // mocked data for now
  const MOCKED = [
    {
      _type: 'list',
      _id: 'list-1',
      _public: true,
      title: 'liste1',
      description: 'beskrivelse1',
      image: null,
      owner: {
        _id: 'owner-1',
        name: 'owner1',
        image: null
      },
      _created: 1000,
      _modified: 2000,
      num_follows: 10,
      num_items: 12,
      num_comments: 143
    },
    {
      _type: 'list',
      _id: 'list-2',
      _public: true,
      title: 'liste2',
      description: 'beskrivelse2',
      image: null,
      owner: {
        _id: 'owner-1',
        name: 'owner1',
        image: null
      },
      _created: 2000,
      _modified: 3000,
      num_follows: 4,
      num_items: 5,
      num_comments: 7
    },
    {
      _type: 'list',
      _id: 'list-3',
      _public: true,
      title: 'liste3',
      description: "Indeholder alle pid'er",
      image: null,
      owner: {
        _id: 'owner-2',
        name: 'owner2',
        image: null
      },
      _created: 3000,
      _modified: 4000,
      num_follows: 400,
      num_items: 50,
      num_comments: 2
    }
  ];

  const data = _.orderBy(MOCKED, SORT_OPTIONS[sort], 'desc');

  return {
    data
  };
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
  aggregation,
  getUser,
  get,
  put,
  find,
  del,
  deleteUser,
  setupObjectStore
};
