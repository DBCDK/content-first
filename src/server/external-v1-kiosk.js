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
        const {branchKey} = req.body;
        const {access_token} = await fetchAnonymousToken();
        const configuration = (await fetchConfiguration(access_token)).kiosk;
        if (!configuration[branchKey]) {
          res.status(401).json({error: 'Invalid branchKey', branchKey});
          return;
        }
        res.status(200).json({configuration: configuration[branchKey]});
      } catch (e) {
        logger.log.error('POST kiosk router - error', {
          source: 'external-v1-kiosk',
          error: String(e)
        });
        res.status(500).end(String(e));
      }
    })
  );

module.exports = router;
