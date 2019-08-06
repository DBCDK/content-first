'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const config = require('server/config');
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const objectStore = require('./objectStore');
const {getUser, setupObjectStore} = objectStore;

(async () => {
  await setupObjectStore(config.storage);
})();

function trimEpoch(timestamp) {
  return Number(timestamp.toString().slice(0, 10));
}

function send(res, data) {
  return res.status(data.errors ? data.errors[0].status : 200).json(data);
}
async function getObject(req, res) {
  send(
    res,
    await objectStore.get(req.params, await getUser(req), req.query.role)
  );
}
async function putObject(req, res) {
  const object = req.body;

  // handle created/modified - this should be handled in the serviceprovider...
  if (!object._id) {
    object._created = Math.round(Date.now() / 1000);
    object._modified = object._created;
  } else {
    object._modified = Math.round(Date.now() / 1000);

    // Just in case the client has set it to a 13 digit epoch
    if (!object._created) {
      object._created = Math.round(Date.now() / 1000);
    } else {
      object._created = trimEpoch(object._created);
    }
  }

  if (req.params.id) {
    object._id = req.params.id;
  }

  const user = await getUser(req);
  if (user) {
    send(res, await objectStore.put(object, user, req.query.role));
  } else {
    send(res, {
      data: {error: 'forbidden'},
      errors: [{message: 'forbidden', status: 403}]
    });
  }
}
async function findObject(req, res) {
  send(
    res,
    await objectStore.find(req.query, await getUser(req), req.query.role)
  );
}
async function deleteObject(req, res) {
  send(
    res,
    await objectStore.del(req.params, await getUser(req), req.query.role)
  );
}
async function aggregation(req, res) {
  send(res, await objectStore.aggregation(req.query, await getUser(req)));
}
async function roles(req, res) {
  send(res, await objectStore.getRoles(await getUser(req)));
}

router.route('/roles').get(asyncMiddleware(roles));
router.route('/aggregation').get(asyncMiddleware(aggregation));
router.route('/find').get(asyncMiddleware(findObject));
router.route('/:id').get(asyncMiddleware(getObject));
router.route('/:id').put(asyncMiddleware(putObject));
router.route('/').post(asyncMiddleware(putObject));
router.route('/:id').delete(asyncMiddleware(deleteObject));
module.exports = router;
