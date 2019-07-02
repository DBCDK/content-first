var source = require('knex')({
  client: 'pg',
  connection: {
    host: '',
    user: '',
    password: '',
    database: ''
  },
  pool: {min: 0, max: 1}
});
var target = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'storage'
  },
  pool: {min: 0, max: 1}
});

let cfType;
const client = 'XclientIdX';
const ADMIN_TOKEN = 'test_admin_token';
const STORAGE_URL = 'http://localhost:8080/v3/storage';

const cfTypeObj = {
  _type: 'bf130fb7-8bd4-44fd-ad1d-43b6020ad102',
  name: 'content-first-objects',
  description: 'Content First object type',
  type: 'json',
  permissions: {read: 'if object.public'},
  indexes: [
    {value: '_id', keys: ['cf_type', 'cf_key', 'cf_created']},
    {value: '_id', keys: ['cf_type', 'cf_created']},
    {
      value: '_id',
      keys: ['_owner', 'cf_type', 'cf_key', 'cf_created'],
      private: true
    },
    {
      value: '_id',
      keys: ['_owner', 'cf_type', 'cf_key', 'cf_created']
    },
    {
      value: '_id',
      keys: ['_owner', 'cf_type', 'cf_created'],
      private: true
    },
    {
      value: '_id',
      keys: ['_owner', 'cf_type', 'cf_created']
    }
  ]
};

const rowToStorageRow = row => {
  const res = {
    id: row.id,
    type: cfType,
    owner: row.owner,
    client,
    version: new Date(row.modified * 1000),
    data: {}
  };
  if (row.public) {
    res.data.public = row.public;
  }
  if (row.type) {
    res.data.cf_type = row.type;
  }
  if (row.key) {
    res.data.cf_key = row.key;
  }
  res.data.cf_created = row.created;
  res.data.cf_modified = row.modified;
  res.data = {...res.data, ...row.data};

  return res;
};

const storageRowToIndex = (indexNum, keys, row) => {
  const res = {
    type: cfType,
    idx: indexNum,
    key: keys
      .map(k => JSON.stringify(k === '_owner' ? row.owner : row.data[k]))
      .join('\n'),
    val: row.id
  };
  return res;
};

(async () => {
  const request = require('superagent');
  cfType = (await request.post(STORAGE_URL).send({
    access_token: ADMIN_TOKEN,
    put: cfTypeObj
  })).body.data._id;
  console.log('created cf type: ', cfType);

  const sourceRes = await source.select('*').from('objects');
  console.log('fetched objects', sourceRes.length);
  const convertedRows = sourceRes.map(row => rowToStorageRow(row));

  for (let i = 0; i < convertedRows.length; i++) {
    for (let j = 0; j < cfTypeObj.indexes.length; j++) {
      const index = cfTypeObj.indexes[j];
      if (!convertedRows[i].data.public && !index.private) {
        continue;
      }
      await target
        .insert(storageRowToIndex(j, index.keys, convertedRows[i]))
        .into('idIndex');
    }
    if (i % 100 === 0) {
      console.log('indexed', i);
    }
  }
  console.log('done indexing');

  for (let i = 0; i < convertedRows.length; i++) {
    // console.log(convertedRows[i]);
    convertedRows[i].data = Buffer.from(
      JSON.stringify(convertedRows[i].data),
      'utf-8'
    );
    await target.insert(convertedRows[i]).into('docs');
    if (i % 100 === 0) {
      console.log('stored', i);
    }
  }
  console.log('done storing objects');
})();
