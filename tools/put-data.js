#!/usr/bin/env node
'use strict';
const crypto = require('crypto');
const request = require('superagent');
const {uniqBy, get} = require('lodash');

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
      let dbStatus;
      if (e.response && e.response.body && e.response.body.services) {
        dbStatus = e.response.body.services.filter(
          s => s.service === 'database'
        )[0].ok;
      }
      if (dbStatus) {
        ready = true;
        taxonomySHA256 = e.response.body.taxonomySHA256;
      } else {
        await new Promise(resolve => {
          setTimeout(() => resolve(), 500);
        });
        console.log('waiting for ' + HOWRU);
      }
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

  // there may be multiple records of the same pid - in that case
  // we take the union of tags.
  const uniqueTags = {};
  tags.forEach(t => {
    if (!uniqueTags[t.pid]) {
      // First time we see this pid - insert it
      t.selected.push({id: '-1', score: 1}); // Hack - all tags need -1, for filtering reasons
      if (librarianRecommends.includes(t.pid)) {
        t.selected.push({id: '-2', score: 1});
      }
      uniqueTags[t.pid] = {...t};
    } else {
      // We've seen this pid before - merge tags
      uniqueTags[t.pid].selected = [
        ...uniqueTags[t.pid].selected,
        ...t.selected
      ];
    }

    // make sure we have no duplicate tags for this pid
    uniqueTags[t.pid].selected = uniqBy(uniqueTags[t.pid].selected, 'id');
  });
  await request
    .put(`${HOST}/v1/tags`)
    .set('Content-Type', 'application/json')
    .send(Object.values(uniqueTags));

  console.log('Uploaded tags'); // eslint-disable-line
}

doWork()
  .then(() => {
    console.log('SUCCES!'); // eslint-disable-line
  })
  .catch(e => {
    console.error('Something went wrong.', e); // eslint-disable-line
    process.exit(1);
  });
