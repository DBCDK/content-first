#!/usr/bin/env node
'use strict';
const request = require('superagent');
const {uniqBy} = require('lodash');

const HOST = process.argv[2];
const taxonomy = require('../src/client/data/exportTaxonomy.json');
const pidinfo = require('../src/client/data/pidinfo.json');
const tags = require('../src/client/data/exportTags.json');
const librarianRecommends = require('../src/client/data/librarian-recommends.json');

async function doWork() {
  await request.put(`${HOST}/v1/taxonomy`)
    .set('Content-Type', 'application/json')
    .send(taxonomy);
  console.log('Uploaded taxonomy'); // eslint-disable-line
  await request.put(`${HOST}/v1/books`)
    .set('Content-Type', 'application/json')
    .send(pidinfo);
  console.log('Uploaded books'); // eslint-disable-line

  const uniqueTags = uniqBy(tags, 'pid');
  uniqueTags.forEach(t => {
    t.selected.push('-1'); // Hack - all tags need -1, for filtering reasons
    if (librarianRecommends.includes(t.pid)) {
      t.selected.push('-2');
    }
  });
  await request.put(`${HOST}/v1/tags`)
    .set('Content-Type', 'application/json')
    .send(uniqueTags);
  console.log('Uploaded tags'); // eslint-disable-line
}

doWork()
  .then(() => {
    console.log('SUCCES!'); // eslint-disable-line
  })
  .catch(e => {
    console.error('Something went wrong', e); // eslint-disable-line
    process.exit(1);
  });
