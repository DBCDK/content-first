/*
 * Public routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/authentication-token', require('server/external-v1-authentication-token'));
router.use('/book', require('server/external-v1-book'));
router.use('/books', require('server/external-v1-books'));
router.use('/complete-taxonomy', require('server/external-v1-complete-taxonomy'));
router.use('/image', require('server/external-v1-image'));
router.use('/login', require('server/external-v1-login'));
router.use('/logout', require('server/external-v1-logout'));
router.use('/recommendations', require('server/external-v1-recommendations'));
router.use('/tags', require('server/external-v1-tags'));
router.use('/taxonomy', require('server/external-v1-taxonomy'));
router.use('/user', require('server/external-v1-user'));

module.exports = router;
