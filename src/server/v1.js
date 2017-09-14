/*
 * Routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/image', require('server/v1-image'));
router.use('/book', require('server/v1-book'));
router.use('/books', require('server/v1-books'));
router.use('/tags', require('server/v1-tags'));
router.use('/recommendations', require('server/v1-recommendations'));

module.exports = router;
