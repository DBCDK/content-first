#!/usr/bin/env node
'use strict';
const request = require('superagent');
const {uniqBy} = require('lodash');
const fs = require('fs');
const targz = require('targz');
const config = require('server/config');

const JSON_FILES_URL = process.env.JSON_FILES_URL;
const INTERNAL_PORT = config.server.internalPort;
const PORT = config.server.port;
const HOST = 'http://localhost:' + INTERNAL_PORT;
const HOWRU = 'http://localhost:' + PORT + '/howru';
const DATA_DIR = process.cwd() + '/src/data/';

const waitForReady = async () => {
  let ready = false;
  while (!ready) {
    try {
      await request.get(`${HOWRU}`);
      ready = true;
    } catch (e) {
      await new Promise(resolve => {
        setTimeout(() => resolve(), 500);
      });
      console.log('waiting for ' + HOWRU);
    }
  }
};
async function doWork() {
  const taxonomy = require('../src/data/exportTaxonomy.json');
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

  console.log('Uploaded tags'); // eslint-disable-line

  var covers = fs.readdirSync(DATA_DIR);
  if (covers) {
    for (let i = 0; i < covers.length; i++) {
      const fileName = covers[i];
      if (fileName.toLowerCase().indexOf('.jpg') === -1) {
        continue;
      }
      const cover = fs.readFileSync(DATA_DIR + fileName);
      const pid = fileName.replace(/\.jpg/gi, '');
      await request
        .put(`${HOST}/v1/image/${pid}`)
        .set('Content-Type', 'image/jpeg')
        .send(cover);
      console.log(`Uploaded cover for pid ${pid}`); // eslint-disable-line
    }
  }
}

doWork()
  .then(() => {
    console.log('SUCCES!'); // eslint-disable-line
  })
  .catch(e => {
    console.error('Something went wrong', e); // eslint-disable-line
    process.exit(1);
  });
