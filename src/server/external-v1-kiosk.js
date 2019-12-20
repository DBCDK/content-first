const asyncMiddleware = require('__/async-express').asyncMiddleware;
const express = require('express');
const logger = require('server/logger');
const router = express.Router({mergeParams: true});
const {fetchAnonymousToken, fetchConfiguration} = require('./smaug');

router
  .route('/')
  //
  // POST /v1/kiosk
  //
  .post(
    asyncMiddleware(async (req, res) => {
      try {
        const {kioskKey} = req.body;
        console.log(kioskKey);
        const {access_token} = await fetchAnonymousToken();
        const configuration = (await fetchConfiguration(access_token)).kiosk;
        configuration[kioskKey];
        if (!configuration[kioskKey]) {
          res.status(401).json({error: 'Invalid kioskKey', kioskKey});
          return;
        }
        res.status(200).json({configuration: configuration[kioskKey]});
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
