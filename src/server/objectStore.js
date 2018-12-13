'use strict';

const assert = require('assert');
const _ = require('lodash');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const objectTable = constants.objects.table;
const uuidGenerator = require('uuid');

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

async function writeObject(o) {
  await knex(objectTable).insert({
    id: o._id,
    rev: o._rev,
    owner: o._owner,
    type: o._type || '',
    key: o._key || '',
    public: !!o._public,
    created: o._created,
    modified: o._modified,
    data: _.omitBy(o, (v, k) => k.startsWith('_'))
  });
}

async function get(id, user = {}) {
  const results = await knex(objectTable)
    .where('id', id)
    .select();
  if (results.length > 0) {
    const object = rowToObject(results[0]);
    if (!object._public && object._owner !== user.openplatformId) {
      return {
        data: {error: 'forbidden'},
        errors: [{status: 403, message: 'forbidden'}]
      };
    }
    return {data: object};
  }

  return {
    data: {error: 'not found'},
    errors: [{status: 404, message: 'not found'}]
  };
}

async function put(object, user) {
  assert(user);
  assert(user.openplatformId);

  const revision =
    Date.now() +
    '-' +
    Math.random()
      .toString(36)
      .slice(2);
  const epoch = (Date.now() / 1000) | 0;

  if (object._id) {
    const prev = await get(object._id, user);
    if (prev.errors) {
      return prev;
    }
    const prevObj = prev.data;
    if (prevObj._owner !== user.openplatformId) {
      return {
        data: {error: 'forbidden'},
        errors: [{status: 403, message: 'forbidden'}]
      };
    }

    let updateQuery = knex(objectTable).where('id', object._id);
    if (object._rev) {
      updateQuery = updateQuery.where('rev', object._rev);
    }
    const result = await updateQuery
      .update({
        rev: revision,
        type: object._type || '',
        key: object._key || '',
        public: !!object._public,
        modified: epoch,
        data: _.omitBy(object, (v, k) => k.startsWith('_'))
      })
      .returning(['id', 'rev']);
    if (result.length === 0) {
      return {
        data: {error: 'conflict'},
        errors: [{status: 409, message: 'conflict'}]
      };
    }
    return {data: {_id: result[0].id, _rev: result[0].rev}};
  }

  object = {
    ...object,
    _id: uuidGenerator.v1(),
    _rev: revision,
    _owner: user.openplatformId,
    _created: epoch,
    _modified: epoch
  };
  await writeObject(object);
  return {data: {_id: object._id, _rev: object._rev}};
}

async function find(query, user = {}) {
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

async function del(id, user) {
  const result = await get(id, user);

  if (result.errors) {
    return {
      data: {error: 'not found'},
      errors: [{status: 404, message: 'not found'}]
    };
  }

  const {
    data: {_owner}
  } = result;
  if (_owner !== user.openplatformId) {
    return {
      data: {error: 'forbidden'},
      errors: [{status: 403, message: 'forbidden'}]
    };
  }
  await knex(objectTable)
    .where('id', id)
    .del();

  return {
    data: {ok: true}
  };
}

module.exports = {getUser, get, put, find, del};
