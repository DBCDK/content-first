const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const express = require('express');
const logger = require('server/logger');
const request = require('superagent');
const router = express.Router({mergeParams: true});

router
  .route('/anonymous_token')
  //
  // GET /v1/openplatform/anonymous_token
  //
  .get(
    asyncMiddleware(async (req, res) => {
      try {
        const result = await request
          .post(config.auth.url + '/oauth/token')
          .auth(config.auth.id, config.auth.secret)
          .send('grant_type=password&username=@&password=@');
        res.status(200).json(result.body);
      } catch (e) {
        logger.log.error({
          source: 'external-v1-openplatform',
          error: String(e)
        });
        res.status(500).end(String(e));
      }
    })
  );

module.exports = router;
