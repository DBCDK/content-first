'use strict';

/*
 * Special endpoint for Hejmdal to redirect to when a user has sucessfully
 * logged in.
 */

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const userTable = constants.users.table;
const cookieTable = constants.cookies.table;
const ms_OneMonth = 30 * 24 * 60 * 60 * 1000;
const loginService = require('server/login');
const uuidv4 = require('uuid/v4');

router.route('/')
  //
  // GET /hejmdal?token=...&id=...
  //
  .get(asyncMiddleware(async (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    const userId = uuidv4();
    const loginToken = uuidv4();
    return loginService.gettingTicket(token, id)
      .then(remoteUser => {
        return knex(userTable).insert({
          uuid: userId,
          name: '',
          gender: remoteUser.gender,
          birth_year: remoteUser.birthYear,
          authors: '[]',
          atmosphere: '[]'
        });
      })
      .then(() => {
        return knex(cookieTable).insert({
          uuid: loginToken,
          user: userId,
          expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000)
        });
      })
      .then(() => {
        return res.status(303)
          .location(constants.pages.start)
          .cookie('login-token', loginToken, {maxAge: ms_OneMonth, httpOnly: true, secure: true})
          .send();
      })
      .catch(error => {
        return res.status(303)
          .location(constants.pages.generalError)
          .send(error);
      });
  }))
;

module.exports = router;
