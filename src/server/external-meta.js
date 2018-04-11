'use strict';

const express = require('express');

const request = require('superagent');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const community = require('server/community');
const config = require('./config');

const showTitles = 3;
const hostUrl = 'http://' + config.server.hostname;

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

      let aPids = listPids.body;
      aPids = aPids.data;

      const pids = aPids.map(p => p.pid);

      let titles =
        'På Læsekompasset kan du gå på opdagelse i skønlitteraturen, få personlige anbefalinger og dele dine oplevelser med andre.';

      // Fetch books from list if any
      if (pids.length > 0) {
        const books = await request
          .get('http://' + host + '/v1/books/')
          .query({pids});

        let aBooks = books.body;
        aBooks = aBooks.data;

        titles = aBooks.map(b => b.book.title);
        titles = titles.slice(0, showTitles).join(', ');

        // Construct title shortner sentence according to showTitle number
        const bookBooks = aBooks.length - showTitles > 1 ? 'bøger' : 'bog';
        const andMore =
          aBooks.length > showTitles
            ? ' & ' + (aBooks.length - showTitles) + ' ' + bookBooks + ' mere'
            : '';

        titles += andMore;
      }

      // Evaluate meta content
      const description =
        list.data.description && list.data.description !== ''
          ? list.data.description
          : titles;
      const img = list.data.image
        ? hostUrl + '/v1/image/' + list.data.image + '/1200/600'
        : hostUrl + '/img/bookcase/NB-bogreol.jpg';

      // Create Meta content in HTML markup
      const title = '<title>' + list.data.title + '</title>';
      const ogTitle =
        '<meta property="og:title" content="' + list.data.title + '" />';
      const ogDescription =
        '<meta property="og:description" content="' + description + '" />';
      const ogImage = '<meta property="og:image" content="' + img + '" />';
      const ogURL =
        '<meta property="og:url" content="' +
        hostUrl +
        '/lister/' +
        listId +
        '" />';

      const ogType = '<meta property="og:type" content="books.reads" />';

      // Build <head>
      const head =
        '<head>' +
        title +
        ogTitle +
        ogType +
        ogDescription +
        ogImage +
        ogURL +
        '</head>';

      const body = '<body>Hello Bot!</body>';

      // Build <html>
      const html = '<html>' + head + body + '</html>';

      // Return Page
      return res.send(html);
    })
  );

module.exports = router;
