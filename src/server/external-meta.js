'use strict';

const express = require('express');
<<<<<<< c03c829f2da790df02b50017caaeba7c9ac81173
const request = require('superagent');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const community = require('server/community');
const config = require('./config');

const showTitles = 3;
=======
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const community = require('server/community');
>>>>>>> added server evaluated list on bot detection

router
  .route('/')

  .get(
    asyncMiddleware(async (req, res, next) => {
      console.log('User Agent: ');
      console.log(req.headers['user-agent']);

      if (JSON.stringify(res.locals) === JSON.stringify({})) {
        console.log('... This is NOT a BOT - return normal page');

        return next();
<<<<<<< 86eb9249a24f42523034165de65c2bfbd28bc6bd
<<<<<<< c03c829f2da790df02b50017caaeba7c9ac81173
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

      const books = await request
        .get('http://' + host + '/v1/books/')
        .query({pids});

      let aBooks = books.body;
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
        '<meta property="og:url" content="http://' +
        config.server.hostname +
        '/lister/' +
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
=======
      } else {
        const listId = req.params.id;
        const list = await community.getObjectById(listId, {});
        const title = '<title>' + list.data.title + '</title>';
        const ogTitle =
          '<meta property="og:title" content="' + list.data.title + '" />';
        const ogDescription =
          '<meta property="og:description" content="' +
          list.data.description +
          '" />';
        const img = list.data.image
          ? list.data.image
          : 'img/bookcase/NB-bogreol.jpg';
        const ogImage =
          '<meta property="og:image" content="/v1/image/' + img + '" />';
        const head =
          '<head>' + title + ogTitle + ogDescription + ogImage + '</head>';
=======
      }
>>>>>>> SocialShareButton Done + ready for demo test

      console.log('... This is a BOT! - return OG:META page');

      const listId = req.params.id;
      const list = await community.getObjectById(listId, {});
      const title = '<title>' + list.data.title + '</title>';
      const ogTitle =
        '<meta property="og:title" content="' + list.data.title + '" />';
      const ogDescription =
        '<meta property="og:description" content="' +
        list.data.description +
        '" />';
      const img = list.data.image
        ? list.data.image
        : 'img/bookcase/NB-bogreol.jpg';
      const ogImage =
        '<meta property="og:image" content="/v1/image/' + img + '" />';
      const ogURL =
        '<meta property="og:url" content="https://content-first.demo.dbc.dk/lister/' +
        listId +
        '" />';
      const head =
        '<head>' +
        title +
        ogTitle +
        ogDescription +
        ogImage +
        ogURL +
        '</head>';

<<<<<<< 86eb9249a24f42523034165de65c2bfbd28bc6bd
        return res.send(html);
      }
>>>>>>> added server evaluated list on bot detection
=======
      const body = '<body>Hello Bot!</body>';
      const html = '<html>' + head + body + '</html>';

      return res.send(html);
>>>>>>> SocialShareButton Done + ready for demo test
    })
  );

module.exports = router;
