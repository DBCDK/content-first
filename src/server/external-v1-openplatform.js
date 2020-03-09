const asyncMiddleware = require('__/async-express').asyncMiddleware;
const express = require('express');
const logger = require('server/logger');
const router = express.Router({mergeParams: true});
const {fetchAnonymousToken} = require('./smaug');

router
  .route('/anonymous_token')
  //
  // GET /v1/openplatform/anonymous_token
  //
  .get(
    asyncMiddleware(async (req, res) => {
      try {

        const result = await fetchAnonymousToken();
        res.status(200).json(result);
      } catch (e) {
        logger.log.error('GET anonymous token - error', {
          source: 'external-v1-openplatform',
          error: String(e)
        });
        res.status(500).end(String(e));
      }
    })
  );

module.exports = router;
