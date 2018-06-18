'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const objectStore = require('./objectStore');
const {getUser} = objectStore;

function send(res, data) {
  return res.status(data.errors ? data.errors[0].status : 200).json(data);
}
async function getObject(req, res) {
  send(res, await objectStore.get(req.params.id, await getUser(req)));
}
async function putObject(req, res) {
  const object = req.body;
  if (req.params.id) {
    object._id = req.params.id;
  }
  const user = await getUser(req);
  if (user) {
    send(res, await objectStore.put(object, user));
  } else {
    send(res, {
      data: {error: 'forbidden'},
      errors: [{message: 'forbidden', status: 403}]
    });
  }
}
async function findObject(req, res) {
  send(res, await objectStore.find(req.query, await getUser(req)));
}

router.route('/find').get(asyncMiddleware(findObject));
router.route('/:id').get(asyncMiddleware(getObject));
router.route('/:id').put(asyncMiddleware(putObject));
router.route('/').post(asyncMiddleware(putObject));
module.exports = router;
