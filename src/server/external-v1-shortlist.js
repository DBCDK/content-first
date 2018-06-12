'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {getUserData, putUserData} = require('server/user');
const logger = require('server/logger');

router
  .route('/')

  //
  // GET /v1/shortlist
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      try {
        res.status(200).json({
          data: (await getUserData({req})).shortlist,
          links: {self: req.baseUrl}
        });
      } catch (error) {
        next(error);
      }
    })
  )

  //
  // PUT /v1/shortlist
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'Data has to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      try {
        const shortlist = req.body;
        await putUserData({shortlist}, req);
        const userData = await getUserData({req});
        res.status(200).json({
          data: userData.shortlist,
          links: {self: location}
        });
      } catch (error) {
        logger.log.error(error);

        const returnedError = {meta: {resource: location}};
        Object.assign(returnedError, error);
        next(returnedError);
      }
    })
  );

module.exports = router;
