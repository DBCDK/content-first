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

      const book = await request.get('http://' + host + '/v1/book/' + pid);
      const bookData = book.body.data;

      const bookCover = 'https://metakompasset.demo.dbc.dk/api/cover/' + pid;

      // const message = 'hello';
      const html = template.constructHtml(
        bookData.title + ' af ' + bookData.creator,
        bookData.taxonomy_description.replace('\n', ', '),
        bookCover,
        hostUrl + req.originalUrl,
        {width: 300, height: 600},
        'Book'
      );

      // Return Page
      return res.send(html);
    })
  );

module.exports = router;
