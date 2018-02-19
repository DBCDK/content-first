'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const community = require('server/community');
const {findingUserIdTroughLoginToken} = require('server/user');

async function getUser(req) {
  const userId = await findingUserIdTroughLoginToken(req);
  const user = await community.gettingUserByProfileId(userId);
  return {id: userId, openplatformId: user.openplatformId, admin: false};
}

async function getObject(req, res) {
  const id = req.params.id;
  const user = await getUser(req);
  // TODO error-code
  res.status(200).json(await community.getObjectById(id, user));
}
async function putObject(req, res) {
  const object = req.body;
  if (req.params.id) {
    object._id = req.params.id;
  }
  const user = await getUser(req);
  const result = await community.putObject({object, user});
  // TODO error-code
  return res.status(200).json(result);
}
async function findObject(req, res) {
  const query = req.query;
  const user = await getUser(req);
  // TODO error-code
  res.status(200).json(await community.findObjects(query, user));
}

router.route('/find').get(asyncMiddleware(findObject));
router.route('/:id').get(asyncMiddleware(getObject));
router.route('/:id').put(asyncMiddleware(putObject));
router.route('/').post(asyncMiddleware(putObject));
module.exports = router;
