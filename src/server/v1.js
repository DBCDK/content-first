/*
 * Routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/image', require('server/v1-image'));
router.use('/books', require('server/v1-books'));

module.exports = router;
