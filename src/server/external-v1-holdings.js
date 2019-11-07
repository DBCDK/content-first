'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const nocache = require('server/nocache');
const _ = require('lodash');
const config = require('server/config');
const logger = require('server/logger');
const Holdings = require('__/services/holdings');

const holdings = new Holdings(config, logger);

const throwIfInsufficientId = ({agencyId, branch, pid}) => {
  if (!agencyId || !branch || !pid) {
    throw {
      status: 400,
      title: 'No id for material',
      detail: `Insufficient identification of the material`
    };
  }
};

router.use(nocache);

router
  .route('/')
  //
  // GET /v1/holdings/?agencyId=xxx&branch=yyy&pid=zzz
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      try {
        throwIfInsufficientId(req.query);
        const query = `holdingsitem.agencyId:${req.query.agencyId} AND holdingsitem.branch:${req.query.branch} AND holdingsitem.bibliographicRecordId:${req.query.pid}`;
        const holdingsData = await holdings.getHoldings({q: query});
        res.status(200).json({
          data: holdingsData
        });
      } catch (error) {
        return next(error);
      }
    })
  );

module.exports = router;
