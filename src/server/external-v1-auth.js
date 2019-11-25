'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('server/passport');
const nocache = require('server/nocache');
const config = require('server/config');

router.use(nocache);

router.get(
  '/callback',
  passport.authenticate('profile', {
    successRedirect: '/replay',
    failureRedirect: '/loginfejl'
  })
);

router.get('/login', passport.authenticate('profile'));

const logout = async (req, res) => {
  if (req.isAuthenticated()) {
    const openplatformToken = req.user.openplatformToken;
    req.logout();
    if (req.cookies && req.cookies['test-user-data']) {
      res
        .clearCookie('test-user-data')
        .clearCookie('login-token')
        .redirect('/');
    } else {
      res.redirect(
        `${config.login.url}/logout/?access_token=${openplatformToken}&redirect_uri=${config.server.dmzHost}`
      );
    }
  } else {
    res.redirect('/');
  }
};

router.get('/logout', logout);
router.post('/logout', logout);

module.exports = {
  router
};
