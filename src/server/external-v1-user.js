'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {getUser, deleteUser, getUserData, putUserData} = require('server/user');
const objectStore = require('server/objectStore');
const _ = require('lodash');

router
  .route('/')

  //
  // GET /v1/user
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;

      try {
        const {openplatformToken} = (await objectStore.getUser(req)) || {};
        const userData = await getUserData({req});
        res.status(200).json({
          data: {...userData, openplatformToken},
          links: {self: location}
        });
      } catch (e) {
        next(e);
      }
    })
  )

  //
  // PUT /v1/user
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;
      try {
        const contentType = req.get('content-type');
        if (contentType !== 'application/json') {
          return next({
            status: 400,
            title: 'Data has to be provided as application/json',
            detail: `Content type ${contentType} is not supported`
          });
        }

        await putUserData(req.body, req);

        return res.status(200).json({
          data: await getUserData({req}),
          links: {self: location}
        });
      } catch (error) {
        const returnedError = {meta: {resource: location}};
        Object.assign(returnedError, error);
        next(returnedError);
      }
    })
  );

router
  .route('/:id')
  //
  // GET /v1/user/:id
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const openplatformId = req.params.id;
      const location = `/v1/user/${encodeURIComponent(openplatformId)}`;
      try {
        const userData = await getUserData({openplatformId, req});

        res.status(200).json({
          data: _.omit(userData, ['id', 'openplatformToken']),
          links: {
            self: location,
            image: userData.image
          }
        });
      } catch (error) {
        return next(error);
      }
    })
  )
  .delete(
    asyncMiddleware(async (req, res, next) => {
      const openplatformId = req.params.id;
      const user = await getUser(req);
      const location = `/v1/user/${encodeURIComponent(openplatformId)}`;
      if (!openplatformId || !user || user.openplatformId !== openplatformId) {
        return next({
          status: 403,
          title: 'Forbidden',
          detail: 'Not allowed to try to delete that user'
        });
      }
      await deleteUser(openplatformId);
      res.status(200).json({
        data: {success: true},
        links: {self: location}
      });
    })
  );

module.exports = router;
