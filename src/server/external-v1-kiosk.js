const asyncMiddleware = require('__/async-express').asyncMiddleware;
const express = require('express');
const logger = require('server/logger');
const router = express.Router({mergeParams: true});
const {fetchAnonymousTokenForClient, fetchConfiguration} = require('./smaug');

router
  .route('/')
  //
  // POST /v1/kiosk
  //
  .post(
    asyncMiddleware(async (req, res) => {
      try {
        const {clientId, clientSecret} = req.body;
        const result = await fetchAnonymousTokenForClient(
          clientId,
          clientSecret
        );
        result.configuration = (await fetchConfiguration(
          result.access_token
        )).kiosk;
        res.status(200).json(result);
      } catch (e) {
        logger.log.error({
          source: 'external-v1-kiosk',
          error: String(e)
        });
        res.status(500).end(String(e));
      }
    })
  );

module.exports = router;
