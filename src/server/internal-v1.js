/*
 * Internal routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/book', require('server/internal-v1-book'));
router.use('/books', require('server/internal-v1-books'));
router.use('/tags', require('server/internal-v1-tags'));
router.use('/stats', require('server/internal-v1-stats'));

module.exports = router;
