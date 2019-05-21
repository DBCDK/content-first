#!/usr/bin/env node
'use strict';
const fs = require('fs');
const request = require('superagent');
const STORAGE_ENV_FILEPATH = './storage_type_id.env';
const config = require('server/config');
if (!config.storage.url) {
  console.error('Missing url to storage service');
  return;
}
if (config.storage.typeId) {
  // type is already created
  return;
}
const fetchAuthenticatedToken = async (username, password) => {
  return (await request
    .post(config.auth.url + '/oauth/token')
    .auth(config.auth.id, config.auth.secret)
    .send(`grant_type=password&username=${username}&password=${password}`)).body
    .access_token;
};
(async () => {
  console.log('Creating storage data type for content first objects');
  const admin_access_token = await fetchAuthenticatedToken(
    config.test.user1.username,
    config.test.user1.pincode
  );
  try {
    const data = (await request.post(config.storage.url).send({
      access_token: admin_access_token,
      put: {
        _type: 'bf130fb7-8bd4-44fd-ad1d-43b6020ad102',
        name: 'content-first-objects',
        description: 'Type used during integration test',
        type: 'json',
        permissions: {read: 'if object.public'},
        indexes: [
          {value: '_id', keys: ['cf_key']},
          {value: '_id', keys: ['cf_type']},
          {value: '_id', keys: ['cf_key', 'cf_type']},
          {value: '_id', keys: ['_owner'], private: true},
          {value: '_id', keys: ['_owner', 'cf_type'], private: true},
          {value: '_id', keys: ['_owner', 'cf_key'], private: true},
          {value: '_id', keys: ['_owner', 'cf_type', 'cf_key']}
        ]
      }
    })).body.data;
    fs.writeFileSync(
      STORAGE_ENV_FILEPATH,
      `### The type id used by the storage service to identify content-first objects
export STORAGE_TYPE_ID=${data._id}
`
    );
    console.log(
      `Storage data type created. The type ID is stored in ${STORAGE_ENV_FILEPATH}`
    );
  } catch (e) {
    console.error('Could not create storage type', e);
  }
})();
