/*
 * Routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/image', require('server/external-v1-image'));
router.use('/book', require('server/external-v1-book'));
router.use('/books', require('server/external-v1-books'));
router.use('/tags', require('server/external-v1-tags'));
router.use('/recommendations', require('server/external-v1-recommendations'));
router.use('/complete-taxonomy', require('server/external-v1-complete-taxonomy'));
router.use('/taxonomy', require('server/external-v1-taxonomy'));
router.use('/login', require('server/external-v1-login'));
router.use('/users', require('server/external-v1-users'));

module.exports = router;
