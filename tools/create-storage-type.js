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
(async () => {
  console.log('Creating storage data type for content first objects');
  try {
    const typeId = (await request('http://localhost:3002/v1/test/initStorage'))
      .text;
    fs.writeFileSync(
      STORAGE_ENV_FILEPATH,
      `### The type id used by the storage service to identify content-first objects
export STORAGE_TYPE_ID=${typeId}
`
    );
    console.log(
      `Storage data type created. The type ID is stored in ${STORAGE_ENV_FILEPATH}`
    );
  } catch (e) {
    console.error('Could not create storage type', e);
  }
})();
