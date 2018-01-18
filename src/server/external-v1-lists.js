'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {
  findingUserIdTroughLoginToken,
  gettingListsFromToken
} = require('server/user');
const {
  creatingList,
  fetchingEntityAndProfileIdFromListCache,
  reservingListForProfileIdInCache,
  updatingList
} = require('server/lists');
const {validatingInput} = require('__/json');
const path = require('path');
const listSchema = path.join(__dirname, 'schemas/list-in.json');
const {gettingListByUuid, deletingListByEntityId} = require('server/lists');
const _ = require('lodash');

router
  .route('/')

  //
  // GET /v1/lists
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;
      return gettingListsFromToken(req)
        .then(lists => {
          res.status(200).json({
            data: lists,
            links: {self: location}
          });
        })
        .catch(error => {
          next(error);
        });
    })
  )

  //
  // POST /v1/lists
  //
  .post(
    asyncMiddleware(async (req, res, next) => {
      const location = req.baseUrl;
      let userId;
      try {
        userId = await findingUserIdTroughLoginToken(req);
      } catch (error) {
        return next(error);
      }
      const uuid = await reservingListForProfileIdInCache(userId);
      const url = `${location}/${uuid}`;
      return res.status(201).json({data: url, links: {self: url}});
    })
  );

router
  .route('/:uuid')

  //
  // PUT /v1/lists/:uuid
  //
  .put(
    asyncMiddleware(async (req, res, next) => {
      const contentType = req.get('content-type');
      if (contentType !== 'application/json') {
        return next({
          status: 400,
          title: 'User data has to be provided as application/json',
          detail: `Content type ${contentType} is not supported`
        });
      }
      const frontendList = req.body;
      try {
        await validatingInput(frontendList, listSchema);
      } catch (error) {
        return next({
          status: 400,
          title: 'Malformed list data',
          detail: 'List data does not adhere to schema',
          meta: error.meta || error
        });
      }
      const uuid = req.params.uuid;
      const location = `${req.baseUrl}/${uuid}`;
      let userId;
      try {
        userId = await findingUserIdTroughLoginToken(req, location);
      } catch (error) {
        return next(error);
      }
      const result = await fetchingEntityAndProfileIdFromListCache(uuid);
      const profileId = result.profileId;
      if (!profileId) {
        return next({
          status: 404,
          title: 'List not found',
          detail: `List ${uuid} does not exist`
        });
      }
      if (profileId !== userId) {
        return next({
          status: 403,
          title: 'Access denied',
          detail: 'List belongs to another user',
          meta: {resource: location}
        });
      }
      let entityId = result.entityId;
      frontendList.id = uuid;
      if (!entityId) {
        try {
          const listPlusCommunityInfo = await creatingList(
            profileId,
            frontendList
          );
          const listWithoutCommunityInfo = _.omit(listPlusCommunityInfo, [
            'links.uuid',
            'links.profile_id',
            'links.entity_id'
          ]);
          return res.status(200).json(listWithoutCommunityInfo);
        } catch (error) {
          return next(error);
        }
      }
      try {
        const listPlusCommunityInfo = await updatingList(
          profileId,
          entityId,
          frontendList
        );
        const listWithoutCommunityInfo = _.omit(listPlusCommunityInfo, [
          'links.uuid',
          'links.profile_id',
          'links.entity_id'
        ]);
        return res.status(200).json(listWithoutCommunityInfo);
      } catch (error) {
        return next(error);
      }
    })
  )

  //
  // DELETE /v1/lists/:uuid
  //
  .delete(
    asyncMiddleware(async (req, res, next) => {
      const uuid = req.params.uuid;
      const location = `${req.baseUrl}/${uuid}`;
      let userId;
      try {
        userId = await findingUserIdTroughLoginToken(req, location);
      } catch (error) {
        return next(error);
      }
      let listPlusCommunityInfo;
      try {
        listPlusCommunityInfo = await gettingListByUuid(uuid);
      } catch (error) {
        // TODO: move this handling to lists.js
        if (error.status === 404) {
          return next(error);
        }
        if (error.status === 403) {
          return next(error);
        }
        let meta = error;
        if (meta.response) {
          meta = meta.response;
        }
        if (meta.error) {
          meta = meta.error;
        }
        return next({
          status: 503,
          title: 'Community-service connection problem',
          detail: 'Community service is not reponding properly',
          meta
        });
      }
      if (userId === listPlusCommunityInfo.links.profile_id) {
        try {
          const entityId = listPlusCommunityInfo.links.entity_id;
          await deletingListByEntityId(userId, entityId);
          return res.status(200).send();
        } catch (error) {
          next(error);
        }
      }
      return next({
        status: 403,
        title: 'Access denied',
        detail: 'Private list',
        meta: {resource: location}
      });
    })
  )

  //
  // GET /v1/lists/:uuid
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const uuid = req.params.uuid;
      let listPlusCommunityInfo;
      try {
        listPlusCommunityInfo = await gettingListByUuid(uuid);
      } catch (error) {
        // TODO: move this handling to lists.js
        if (error.status === 404) {
          return next(error);
        }
        if (error.status === 403) {
          return next(error);
        }
        let meta = error;
        if (meta.response) {
          meta = meta.response;
        }
        if (meta.error) {
          meta = meta.error;
        }
        return next({
          status: 503,
          title: 'Community-service connection problem',
          detail: 'Community service is not reponding properly',
          meta
        });
      }
      const listWithoutCommunityInfo = _.omit(listPlusCommunityInfo, [
        'links.uuid',
        'links.profile_id',
        'links.entity_id'
      ]);
      if (listPlusCommunityInfo.data.public) {
        return res.status(200).json(listWithoutCommunityInfo);
      }
      const location = `${req.baseUrl}/${uuid}`;
      let userId;
      try {
        userId = await findingUserIdTroughLoginToken(req, location);
      } catch (error) {
        return next(error);
      }
      if (userId === listPlusCommunityInfo.links.profile_id) {
        return res.status(200).json(listWithoutCommunityInfo);
      }
      return next({
        status: 403,
        title: 'Access denied',
        detail: 'Private list',
        meta: {resource: location}
      });
    })
  );

module.exports = router;
