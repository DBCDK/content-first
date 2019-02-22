'use strict';

const passport = require('passport');
const {Strategy} = require('passport-oauth2');
const config = require('server/config');
const {createCookie, fetchCookie} = require('server/user');
const request = require('superagent');
const {get} = require('lodash');
const logger = require('server/logger');
const moment = require('moment');

const profileStrategy = new Strategy(
  {
    authorizationURL: config.login.url + '/oauth/authorize',
    tokenURL: config.login.url + '/oauth/token',
    clientID: config.auth.id,
    clientSecret: config.auth.id,
    callbackURL: config.server.dmzHost + '/v1/auth/callback'
  },

  async function(token, tokenSecret, profile, done) {
    let uniqueId;
    let legacyId;
    let special = {over13: false, name: ''};

    const over13 = cpr => {
      let bd = cpr.substr(0, 6);

      let now = moment();
      let n = now.format('DDMMYYYY');
      let yearNow = n.substr(6, 2);

      let dayMonth = bd.substr(0, 4);
      let yearCheck = bd.substr(4, 2);

      let fullBirthYear =
        yearCheck > yearNow ? '19' + yearCheck : '20' + yearCheck;

      let fullDate = dayMonth + fullBirthYear;
      let bdMoment = moment(fullDate, 'DDMMYYYY');

      let age = now.diff(bdMoment, 'years');
      return age > 13 ? true : false;
    };

    try {
      try {
        const userInfo = await request
          .get(config.login.url + '/userinfo')
          .set('Authorization', 'Bearer ' + token);

        special.over13 = over13(userInfo.body.attributes.cpr);
        // special.over13 = over13('1224061212');

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

passport.serializeUser(async function(user, done) {
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

passport.deserializeUser(async function(cookie, done) {
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
