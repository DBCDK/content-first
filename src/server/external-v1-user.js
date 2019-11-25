'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {
  getUser,
  deleteUser,
  getUserData,
  putUserData,
  requireLoggedIn
} = require('server/user');
const nocache = require('server/nocache');
const _ = require('lodash');

router.use(nocache);

router
  .route('/')

  //
  // GET /v1/user
  //
  .get(
    requireLoggedIn,
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;
      try {
        const userData = await getUserData(req.user.openplatformId, req.user);

        res.status(200).json({
          data: {
            ...userData,
            openplatformToken: req.user.openplatformToken,
            over13: req.user.special.over13,
            tempname: req.user.special.name
          },
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
    requireLoggedIn,
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

        await putUserData(req.body, req.user);

        return res.status(200).json({
          data: await getUserData(req.user.openplatformId, req.user),
          links: {self: location}
        });
      } catch (error) {
        const returnedError = {meta: {resource: location}};
        Object.assign(returnedError, error);
        next(returnedError);
      }
    })
  );

const deleteAndLogout = async (req, res, next) => {
  const openplatformId = req.params.id;
  const user = await getUser(req);
  if (!openplatformId || !user || user.openplatformId !== openplatformId) {
    return next({
      status: 403,
      title: 'Forbidden',
      detail: 'Not allowed to try to delete that user'
    });
  }
  await deleteUser(user);
  res.redirect('/v1/auth/logout');
};

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
        const userData = await getUserData(openplatformId, req.user);

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
  .post(requireLoggedIn, asyncMiddleware(deleteAndLogout))
  .delete(requireLoggedIn, asyncMiddleware(deleteAndLogout));

module.exports = router;
