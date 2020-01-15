'use strict';

const express = require('express');
const helmet = require('helmet');
const router = express.Router({mergeParams: true});
const nocache = require('server/nocache');

router.use(nocache);
router.use(
  helmet.frameguard({action: 'ALLOW-FROM', domain: 'https://login.bib.dk/'})
);

router
  .route('/')
  //
  // GET /v1/logout
  //
  .get((req, res) => {
    req.logout();
    if (req.cookies && req.cookies['test-user-data']) {
      res.clearCookie('test-user-data').clearCookie('login-token');
    }
    res.status(200).json({statusCode: 200});
  });

module.exports = router;
