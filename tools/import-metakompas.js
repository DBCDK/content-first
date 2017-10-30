#!/usr/bin/env node
'use strict';

const request = require('superagent');
const fs = require('fs-extra');

function requiredEnv(key) {
  if (!process.env[key]) {
    throw `Missing env variable '${key}'`;
  }
  return process.env[key];
}

const metakompasTaxonomyUrl = requiredEnv('METAKOMPAS_TAXONOMY_URL');
const metakompasTagsUrl = requiredEnv('METAKOMPAS_TAGS_URL');
const metakompasWorksUrl = requiredEnv('METAKOMPAS_WORKS_URL');
const outputFolder = requiredEnv('OUTPUT_FOLDER');
const coversFolder = `${outputFolder}/covers`;

async function begin() {
  // create output folder
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }
  // create covers folder
  if (!fs.existsSync(coversFolder)) {
    fs.mkdirSync(coversFolder);
  }

  const taxonomyResponse = await request.get(metakompasTaxonomyUrl);
  const taxonomyParsed = JSON.parse(taxonomyResponse.text);
  console.log('Downloaded taxonomy');
  await fs.writeFile(`${outputFolder}/taxonomy.json`, JSON.stringify(taxonomyParsed, null, 2));
  console.log('Taxonomy written to file system');

  const tagsResponse = await request.get(metakompasTagsUrl);
  const tagsParsed = JSON.parse(tagsResponse.text);
  console.log('Downloaded tags');
  await fs.writeFile(`${outputFolder}/tags.json`, JSON.stringify(tagsParsed, null, 2));
  console.log('Tags written to file system');

  const worksResponse = await request.get(metakompasWorksUrl);
  const worksParsed = JSON.parse(worksResponse.text);
  console.log('Downloaded work data');
  await fs.writeFile(`${outputFolder}/works.json`, JSON.stringify(worksParsed, null, 2));
  console.log('Works written to file system');

  console.log('Fetching cover images...');
  for (let i = 0; i < worksParsed.length; i++) {
    const work = worksParsed[i];
    const path = `${coversFolder}/${work.pid}.jpg`;
    if (!fs.existsSync(path)) {
      const coverResponse = await request.get(work.image_detail_500);
      await fs.writeFile(path, coverResponse.body);
      console.log(`Downloaded ${path}`);
    }
  }
}

begin()
  .then(() => {
    console.log('done');
    process.exit(0);
  })
  .catch((e) => {
    console.log('some error occurred', e);
    process.exit(1);
  });
