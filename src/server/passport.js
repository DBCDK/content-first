'use strict';

const passport = require('passport');
const {Strategy} = require('passport-oauth2');
const config = require('server/config');
const request = require('superagent');
const {get} = require('lodash');
const logger = require('server/logger');
const over13 =require('./utils/over13');
const {createCookie, fetchCookie} = require('server/user');


const profileStrategy = new Strategy(
  {
    authorizationURL: config.login.url + '/oauth/authorize',
    tokenURL: config.login.url + '/oauth/token',
    clientID: config.auth.id,
    clientSecret: config.auth.id,
    callbackURL: config.server.dmzHost + '/v1/auth/callback'
  },

  async function (token, tokenSecret, profile, done) {
    let uniqueId;
    let legacyId;
    let special = {over13: false, name: ''};

    try {
      try {
        const userInfo = await request
          .get(config.login.url + '/userinfo')
          .set('Authorization', 'Bearer ' + token);

        special.over13 = over13(userInfo.body.attributes.cpr);
        // to test result in gui when user is under 13
        // special.over13 = over13('2412061212');

        uniqueId = get(userInfo, 'body.attributes.uniqueId');
        if (!uniqueId) {
          throw new Error('Missing uniqueId');
        }
      } catch (e) {
        logger.log.error({
          token,
          description: 'Error fetching userinfo',
          error: String(e)
        });
        throw e;
      }

      try {
        const openplatformUser = await request
          .get(config.login.openplatformUrl + '/user')
          .query({access_token: token});

        legacyId = get(openplatformUser, 'body.data.id');
        special.name = get(openplatformUser, 'body.data.name');
        if (!legacyId) {
          throw new Error('Missing legacyId');
        }
      } catch (e) {
        logger.log.error({
          token,
          description: 'Error fetching openplatform user',
          error: String(e)
        });
        throw e;
      }
      done(null, {openplatformToken: token, uniqueId, legacyId, special});
    } catch (e) {
      done(null, false);
    }
  }
);

passport.use('profile', profileStrategy);

passport.serializeUser(async function (user, done) {
  try {
    const cookie = await createCookie(
      user.legacyId,
      user.uniqueId,
      user.openplatformToken,
      user.special
    );
    done(null, cookie);
  } catch (e) {
    logger.log.error({
      description: 'Error serializing user',
      error: String(e)
    });
    done(null, false);
  }
});

passport.deserializeUser(async function (cookie, done) {
  try {
    const user = await fetchCookie(cookie);
    done(null, user);
  } catch (e) {
    logger.log.error({
      description: 'Error deserializing user',
      error: String(e)
    });
    done(null, false);
  }
});


module.exports = passport;
