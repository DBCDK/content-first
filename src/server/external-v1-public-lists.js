'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const _ = require('lodash');
const {gettingPublicLists, omitCommunityInfoFromList} = require('server/lists');
const constants = require('server/constants')();

router
  .route('/')

  //
  // GET /v1/public-lists?offset=...&limit=...
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const query = req.query;
      const limit = parseInt(query.limit, 10) || constants.lists.defaultLimit;
      const offset = parseInt(query.offset, 10) || 0;
      const location = `${req.baseUrl}?limit=${limit}&offset=${offset}`;
      let listPlusCommunityInfo;
      let nextOffset;
      try {
        const result = await gettingPublicLists(limit, offset);
        listPlusCommunityInfo = result.lists;
        nextOffset = result.next_offset;
      } catch (error) {
        return next(error);
      }
      return res.status(200).json({
        data: _.map(listPlusCommunityInfo, omitCommunityInfoFromList),
        links: {
          self: location,
          next: `${req.baseUrl}?limit=${limit}&offset=${nextOffset}`
        }
      });
    })
  );

module.exports = router;
