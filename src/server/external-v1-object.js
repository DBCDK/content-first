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

function send(res, data) {
  return res.status(data.errors ? data.errors[0].status : 200).json(data);
}
async function getObject(req, res) {
  send(res, await objectStore.get(req.params, getUser(req), req.query.role));
}
async function putObject(req, res) {
  send(res, await objectStore.put(req.body, getUser(req), req.query.role));
}
async function findObject(req, res) {
  send(res, await objectStore.find(req.query, getUser(req), req.query.role));
}
async function deleteObject(req, res) {
  send(res, await objectStore.del(req.params, getUser(req), req.query.role));
}
async function aggregation(req, res) {
  send(res, await objectStore.aggregation(req.query, getUser(req)));
}

router.route('/aggregation').get(asyncMiddleware(aggregation));
router.route('/find').get(asyncMiddleware(findObject));
router.route('/:id').get(asyncMiddleware(getObject));
router.route('/:id').put(asyncMiddleware(putObject));
router.route('/').post(asyncMiddleware(putObject));
router.route('/:id').delete(asyncMiddleware(deleteObject));
module.exports = router;
