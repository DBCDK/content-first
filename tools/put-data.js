#!/usr/bin/env node
'use strict';
const crypto = require('crypto');
const request = require('superagent');
const {uniqBy} = require('lodash');

const INTERNAL_PORT = process.env.INTERNAL_PORT || 3002;
const PORT = process.env.PORT || 3001;
const HOST = (process.env.HOST || 'http://localhost') + ':' + INTERNAL_PORT;
const HOWRU = (process.env.HOST || 'http://localhost') + ':' + PORT + '/howru';

const waitForReady = async () => {
  let ready = false;
  let taxonomySHA256;
  while (!ready) {
    try {
      const response = await request.get(`${HOWRU}`);
      ready = true;
      taxonomySHA256 = response.body.taxonomySHA256;
    } catch (e) {
      await new Promise(resolve => {
        setTimeout(() => resolve(), 500);
      });
      console.log('waiting for ' + HOWRU);
    }
  }
  return taxonomySHA256;
};
async function doWork() {
  const taxonomy = require('../src/data/exportTaxonomy.json');
  const taxonomySHA256 = crypto
    .createHash('sha256')
    .update(JSON.stringify(taxonomy))
    .digest('hex');
  const pidinfo = require('../src/data/pidinfo.json');
  const tags = require('../src/data/exportTags.json');
  const librarianRecommends = require('../src/data/librarian-recommends.json');

  const remoteTaxonomySHA256 = await waitForReady();
  if (remoteTaxonomySHA256 !== taxonomySHA256) {
    throw `TAXONOMY MISMATCH!
REMOTE_SHA256=${remoteTaxonomySHA256}
LOCAL_SHA256=${taxonomySHA256}

This means that the "metakompas" instance is ahead of (or behind) "${HOST}" regarding the taxonomy
Solve this by deploying metakompas, content-first or maybe both.. :)
`;
  }
  await request
    .put(`${HOST}/v1/books`)
    .set('Content-Type', 'application/json')
    .send(
      pidinfo.map(entry =>
        Object.assign(entry, {
          unitId: entry.unitId || '',
          bibliographicRecordId: entry.bibliographicRecordId || '-1'
        })
      )
    );

  console.log('Uploaded books'); // eslint-disable-line

  const uniqueTags = uniqBy(tags, 'pid');
  uniqueTags.forEach(t => {
    t.selected.push({id: '-1', score: 1}); // Hack - all tags need -1, for filtering reasons
    if (librarianRecommends.includes(t.pid)) {
      t.selected.push({id: '-2', score: 1});
    }
    t.selected = uniqBy(t.selected, 'id');
  });
  await request
    .put(`${HOST}/v1/tags`)
    .set('Content-Type', 'application/json')
    .send(uniqueTags);
}

doWork()
  .then(() => {
    console.log('SUCCES!'); // eslint-disable-line
  })
  .catch(e => {
    console.error('Something went wrong.', e); // eslint-disable-line
    process.exit(1);
  });
