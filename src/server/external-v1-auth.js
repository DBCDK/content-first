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
    failureRedirect: '/error'
  })
);

router.get('/login', passport.authenticate('profile'));

router.post('/logout', async (req, res) => {
  if (req.isAuthenticated()) {
    const openplatformToken = req.user.openplatformToken;
    req.logout();
    res.redirect(
      `${config.login.url}/logout/?access_token=${openplatformToken}`
    );
  } else {
    res.redirect('/');
  }
});

module.exports = {
  router
};
