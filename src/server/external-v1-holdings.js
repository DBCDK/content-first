'use strict';

import {chunk, isEqual, uniqWith} from 'lodash';

const express = require('express');
const request = require('superagent');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const nocache = require('server/nocache');
const config = require('server/config');
const logger = require('server/logger');
const Holdings = require('__/services/holdings');
const IDMapper = require('__/services/idmapper');
const {fetchAnonymousToken} = require('./smaug');

const holdings = new Holdings(config, logger);
const idmapper = new IDMapper(config, logger);

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
        const idmappings = await idmapper.pidToWorkPids(pids);
        const pidsExpanded = pids.reduce(
          (allPids, pid) =>
            idmappings[pid]
              ? [...allPids, ...idmappings[pid]]
              : [...allPids, pid],
          []
        );

        const chunks = chunk(pidsExpanded, 20);
        const chunksRes = await Promise.all(
          chunks.map(async pidsChunk => {
            const holdingsRes = await holdings.getHoldings(
              req.query.agencyId,
              req.query.branch,
              pidsChunk
            );

            const pidsWithHolding = pidsChunk.filter(pid => !!holdingsRes[pid]);
            if (pidsWithHolding.length === 0) {
              return {};
            }

            const types = (
              await request.post(config.login.openplatformUrl + '/work').send({
                pids: pidsWithHolding,
                fields: ['type'],
                access_token: (await fetchAnonymousToken()).access_token
              })
            ).body.data.map(entry => entry && entry.type && entry.type[0], '');

            let combined = {};
            pidsWithHolding.forEach((pid, idx) => {
              combined[pid] = holdingsRes[pid].map(holding => ({
                pid,
                ...holding,
                type: types[idx]
              }));
            });
            return combined;
          })
        );

        const pidToHoldingMap = chunksRes.reduce(
          (map, chunkRes) => ({...map, ...chunkRes}),
          {}
        );

        const uniqueRes = pid => {
          if (!idmappings[pid]) {
            return [];
          }
          const records = [];
          idmappings[pid].forEach(p => {
            if (pidToHoldingMap[p]) {
              pidToHoldingMap[p].forEach(item => records.push(item));
            }
          });
          return uniqWith(records, isEqual).filter(holding => !!holding);
        };

        const result = pids.reduce(
          (map, pid) => ({
            ...map,
            [pid]: uniqueRes(pid)
          }),
          {}
        );

        res.status(200).json(result);
      } catch (error) {
        return next(error);
      }
    })
  );

module.exports = router;
