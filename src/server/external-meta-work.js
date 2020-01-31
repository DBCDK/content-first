'use strict';

const express = require('express');

const request = require('superagent');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('./config');
const template = require('./meta-response-template');

const hostUrl = 'http://' + config.server.hostname;

router
  .route('/')

  .get(
    asyncMiddleware(async (req, res, next) => {
      if (JSON.stringify(res.locals) === JSON.stringify({})) {
        return next();
      }

      const pid = req.params.pid;
      const host = req.get('host');

      const response = await request
        .get('http://' + host + '/v1/books/')
        .query({pids: pid});

      const bookData = response.body.data[0].book;
      const description =
        bookData.taxonomy_description ||
        bookData.taxonomy_description_subjects ||
        bookData.description ||
        '';
      const html = template.constructHtml(
        bookData.title + ' af ' + bookData.creator,
        description.replace('\n', ', '),
        bookData.coverUrl,
        hostUrl + req.originalUrl,
        {width: 300, height: 600},
        'book'
      );

      // Return Page
      return res.send(html);
    })
  );

module.exports = router;
