'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const nocache = require('server/nocache');
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
        const pids = Array.isArray(req.query.pid)
          ? req.query.pid
          : [req.query.pid];
        const result = await holdings.getHoldings(
          req.query.agencyId,
          req.query.branch,
          pids
        );
        res.status(200).json(result);
      } catch (error) {
        return next(error);
      }
    })
  );

module.exports = router;
