/*
 * Route for React frontend.
 */
'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '..', '..', 'build')));

router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'));
});

module.exports = router;
