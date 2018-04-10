'use strict';

const express = require('express');
const request = require('superagent');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const community = require('server/community');

const showTitles = 3;

router
  .route('/')

  .get(
    asyncMiddleware(async (req, res, next) => {
      if (JSON.stringify(res.locals) === JSON.stringify({})) {
        return next();
      }

      const listId = req.params.id;
      const list = await community.getObjectById(listId, {});
      const host = req.get('host');

      const listPids = await request
        .get('http://' + host + '/v1/object/find')
        .query({
          type: 'list-entry',
          key: listId
        });

      let aPids = JSON.parse(listPids.text);
      aPids = aPids.data;

      const pids = aPids.map(p => p.pid);

      const books = await request
        .get('http://' + host + '/v1/books/')
        .query({pids});

      let aBooks = JSON.parse(books.text);
      aBooks = aBooks.data;

      let titles = aBooks.map(b => b.book.title);
      titles = titles.slice(0, showTitles).join(', ');

      // Construct title shortner sentence according to showTitle number
      const bookBooks = aBooks.length - showTitles > 1 ? 'bøger' : 'bog';

      const andMore =
        aBooks.length > showTitles
          ? ' & ' + (aBooks.length - showTitles) + ' ' + bookBooks + ' mere'
          : '';

      titles += andMore;

      // Evaluate meta content
      const description =
        list.data.description && list.data.description !== ''
          ? list.data.description
          : titles;
      const img = list.data.image
        ? list.data.image
        : 'img/bookcase/NB-bogreol.jpg';

      // Create Meta content in HTML markup
      const title = '<title>' + list.data.title + '</title>';
      const ogTitle =
        '<meta property="og:title" content="' + list.data.title + '" />';
      const ogDescription =
        '<meta property="og:description" content="' + description + '" />';
      const ogImage =
        '<meta property="og:image" content="/v1/image/' + img + '" />';
      const ogURL =
        '<meta property="og:url" content="https://content-first.demo.dbc.dk/lister/' +
        listId +
        '" />';

      // Build <head>
      const head =
        '<head>' +
        title +
        ogTitle +
        ogDescription +
        ogImage +
        ogURL +
        '</head>';

      // Build <body>
      const body = '<body>Hello Bot!</body>';

      // Build <html>
      const html = '<html>' + head + body + '</html>';

      // Return Page
      return res.send(html);
    })
  );

module.exports = router;
