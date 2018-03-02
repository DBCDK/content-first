#!/usr/bin/env node
'use strict';
const request = require('superagent');
const fs = require('fs');
const targz = require('targz');

const JSON_FILES_URL = process.env.JSON_FILES_URL;
const DATA_DIR = process.cwd() + '/src/data/';
const TAR_GZ_PATH = DATA_DIR + 'json.tar.gz';

async function doWork() {
  await new Promise(resolve =>
    request
      .get(JSON_FILES_URL)
      .pipe(fs.createWriteStream(TAR_GZ_PATH))
      .on('finish', resolve)
  );
  console.log('Downloaded json files'); // eslint-disable-line

  await new Promise((resolve, reject) => {
    targz.decompress(
      {
        src: TAR_GZ_PATH,
        dest: DATA_DIR
      },
      err => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      }
    );
  });
  console.log('Decompressed json files'); // eslint-disable-line
}

doWork()
  .then(() => {
    console.log('SUCCES!'); // eslint-disable-line
  })
  .catch(e => {
    console.error('Something went wrong', e); // eslint-disable-line
    process.exit(1);
  });
