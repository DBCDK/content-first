'use strict';

const passport = require('passport');
const {Strategy} = require('passport-oauth2');
const config = require('server/config');
const {createCookie, fetchCookie} = require('server/user');
const request = require('superagent');
const {get} = require('lodash');
const logger = require('server/logger');

const profileStrategy = new Strategy(
  {
    authorizationURL: config.auth.url + '/oauth/authorize',
    tokenURL: config.auth.url + '/oauth/token',
    clientID: config.auth.id,
    clientSecret: config.auth.id,
    callbackURL: config.server.dmzHost + '/v1/auth/callback'
  },
  async function(token, tokenSecret, profile, done) {
    try {
      const userInfo = await request
        .get(config.auth.url + '/userinfo')
        .set('Authorization', 'Bearer ' + token);
      const uniqueId = get(userInfo, 'body.attributes.uniqueId');
      if (!uniqueId) {
        throw new Error('Missing uniqueId');
      }
      done(null, {openplatformToken: token, uniqueId, legacyId: 'leg'});
    } catch (e) {
      logger.log.error({
        description: 'Could not log in',
        error: String(e)
      });
      done(e);
    }
  }
);

passport.use('profile', profileStrategy);

passport.serializeUser(async function(user, done) {
  try {
    const cookie = await createCookie(
      user.legacyId,
      user.uniqueId,
      user.openplatformToken
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
