'use strict';

const passport = require('passport');
const {Strategy} = require('passport-oauth2');
const config = require('server/config');
const request = require('superagent');
const {get} = require('lodash');
const logger = require('server/logger');
const over13 = require('./utils/over13');
const {createCookie, fetchCookie, putPrivatUserData} = require('server/user');

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
    let municipality;
    let municipalityAgencyId;
    let special = {over13: false, name: ''};

    try {
      try {
        const userInfo = await request
          .get(config.login.url + '/userinfo')
          .set('Authorization', 'Bearer ' + token);

        // Get users municipalityAgencyId
        municipalityAgencyId = get(
          userInfo,
          'body.attributes.municipalityAgencyId',
          null
        );

        // Get users municipality
        municipality = get(userInfo, 'body.attributes.municipality', null);

        special.over13 = over13(get(userInfo, 'body.attributes.cpr', null));
        // to test result in gui when user is under 13
        // special.over13 = over13('2412061212');

        uniqueId = get(userInfo, 'body.attributes.uniqueId');
        if (!uniqueId) {
          throw new Error('Missing uniqueId');
        }
      } catch (e) {
        logger.log.error('Error fetching userinfo', {
          token,
          errorMessage: e.message,
          stack: e.stack
        });
        throw e;
      }

      done(null, {
        openplatformToken: token,
        uniqueId,
        special,
        municipality,
        municipalityAgencyId
      });
    } catch (e) {
      done(null, false);
    }
  }
);

passport.use('profile', profileStrategy);

passport.serializeUser(async function(user, done) {
  try {
    const cookie = await createCookie(
      user.uniqueId,
      user.openplatformToken,
      user.special
    );

    await putPrivatUserData(user);
    done(null, cookie);
  } catch (e) {
    logger.log.error('Error serializing user', {
      errorMessage: e.message,
      stack: e.stack
    });
    done(null, false);
  }
});

passport.deserializeUser(async function(cookie, done) {
  try {
    const user = await fetchCookie(cookie);
    done(null, user);
  } catch (e) {
    logger.log.error('Error deserializing user', {
      errorMessage: e.message,
      stack: e.stack
    });
    done(null, false);
  }
});

module.exports = passport;
