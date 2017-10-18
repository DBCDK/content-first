/*
 * Internal routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/image', require('server/internal-v1-image'));
router.use('/book', require('server/internal-v1-book'));
router.use('/tags', require('server/internal-v1-tags'));
router.use('/taxonomy', require('server/internal-v1-taxonomy'));

module.exports = router;
