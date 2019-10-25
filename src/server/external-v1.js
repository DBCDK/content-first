/*
 * Public routes for version 1 endpoints.
 */

'use strict';

const config = require('server/config');

const express = require('express');
const router = express.Router();

router.use('/book', require('server/external-v1-book'));
router.use('/books', require('server/external-v1-books').router);
router.use(
  '/complete-taxonomy',
  require('server/external-v1-complete-taxonomy')
);
router.use('/image', require('server/external-v1-image'));
router.use('/log', require('server/external-v1-log'));
router.use('/object', require('server/external-v1-object'));
router.use('/openplatform', require('server/external-v1-openplatform'));
router.use('/recommendations', require('server/external-v1-recommendations'));
router.use('/search', require('server/external-v1-search'));
router.use('/shortlist', require('server/external-v1-shortlist'));
router.use('/tags', require('server/external-v1-tags'));
router.use('/taxonomy', require('server/external-v1-taxonomy'));
router.use('/user', require('server/external-v1-user'));
router.use('/recompass', require('server/external-v1-recompass'));
router.use('/stats', require('server/external-v1-stats'));
router.use('/auth', require('server/external-v1-auth').router);
router.use('/suggester', require('server/external-v1-suggester'));
router.use('/searcher', require('server/external-v1-searcher'));
router.use('/initial-state', require('server/external-v1-initial-state'));
router.use('/kiosk', require('server/external-v1-kiosk'));
if (config.server.environment !== 'production') {
  router.use('/test', require('server/internal-v1-test'));
}

module.exports = router;
