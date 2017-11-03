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
const logger = require('server/logger');
const constants = require('server/constants')();
const userTable = constants.users.table;
const cookieTable = constants.cookies.table;
const ms_OneMonth = 30 * 24 * 60 * 60 * 1000;
const loginService = require('server/login');
const uuidv4 = require('uuid/v4');
const {findUserByCpr, updatingUser} = require('server/user');

router.route('/')
  //
  // GET /hejmdal?token=...&id=...
  //
  .get(asyncMiddleware(async (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    let userUuid;
    const loginToken = uuidv4();
    return loginService.gettingTicket(token, id)
      .then(remoteUser => {
        // logger.log.info('Got remote user data');
        return Promise.all([
          findUserByCpr(remoteUser.cpr),
          remoteUser
        ]);
      })
      .then(results => {
        const uuid = results[0];
        const remoteUser = results[1];
        if (uuid) {
          userUuid = uuid;
          return updatingUser(uuid, {
            gender: remoteUser.gender,
            birth_year: remoteUser.birthYear,
            user_id: remoteUser.userId,
            wayf_id: remoteUser.wayfId,
            unilogin_id: remoteUser.uniloginId,
            municipality: remoteUser.municipality
          });
        }
        userUuid = uuidv4();
        return knex(userTable).insert({
          uuid: userUuid,
          name: '',
          authors: '[]',
          atmosphere: '[]',
          gender: remoteUser.gender,
          birth_year: remoteUser.birthYear,
          user_id: remoteUser.userId,
          wayf_id: remoteUser.wayfId,
          unilogin_id: remoteUser.uniloginId,
          municipality: remoteUser.municipality
        });
      })
      .then(() => {
        return knex(cookieTable).insert({
          uuid: loginToken,
          user: userUuid,
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
        logger.log.info(`Could not get remote user data: ${JSON.stringify(error)}`);
        return res.status(303)
          .location(constants.pages.generalError)
          .send(error);
      });
  }))
;

module.exports = router;
