/*
 * Public routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/book', require('server/external-v1-book'));
router.use('/books', require('server/external-v1-books'));
router.use(
  '/complete-taxonomy',
  require('server/external-v1-complete-taxonomy')
);
router.use('/image', require('server/external-v1-image'));
router.use('/lists', require('server/external-v1-lists'));
router.use('/login', require('server/external-v1-login'));
router.use('/logout', require('server/external-v1-logout'));
router.use('/profiles', require('server/external-v1-profiles'));
router.use('/recommendations', require('server/external-v1-recommendations'));
router.use('/search', require('server/external-v1-search'));
router.use('/shortlist', require('server/external-v1-shortlist'));
router.use('/tags', require('server/external-v1-tags'));
router.use('/taxonomy', require('server/external-v1-taxonomy'));
router.use('/user', require('server/external-v1-user'));

module.exports = router;
