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
  while (!ready) {
    try {
      const response = await request.get(`${HOWRU}`);
      ready = true;
    } catch (e) {
      let dbStatus;
      if (e.response && e.response.body && e.response.body.services) {
        dbStatus = e.response.body.services.filter(
          s => s.service === 'database'
        )[0].ok;
      }
      if (dbStatus) {
        ready = true;
      } else {
        await new Promise(resolve => {
          setTimeout(() => resolve(), 500);
        });
        console.log('waiting for ' + HOWRU);
      }
    }
  }
};
async function doWork() {
  const pidinfo = require('../src/data/pidinfo.json');
  const tags = require('../src/data/exportTags.json');
  const librarianRecommends = require('../src/data/librarian-recommends.json');
  await waitForReady();
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
    uniqueTags[t.pid].selected = uniqBy(
      uniqueTags[t.pid].selected.map(t => ({...t, id: parseInt(t.id)})),
      'id'
    );
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
