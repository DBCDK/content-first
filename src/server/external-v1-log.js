const express = require('express');
const logger = require('server/logger');
const router = express.Router({mergeParams: true});

router
  .route('/')
  //
  // POST /v1/openplatform/log
  //
  .post((req, res) => {
    logger.log.info('POST client - openplatform', {
      cookie: req.headers.cookie,
      action: req.body
    });
    res.end();
  });

module.exports = router;
