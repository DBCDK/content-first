'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const community = require('server/community');

router
  .route('/')

  .get(
    asyncMiddleware(async (req, res, next) => {
      console.log('User Agent: ');
      console.log(req.headers['user-agent']);

      if (JSON.stringify(res.locals) === JSON.stringify({})) {
        console.log('... This is NOT a BOT - return normal page');

        return next();
      }

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

      const body = '<body>Hello Bot!</body>';
      const html = '<html>' + head + body + '</html>';

      return res.send(html);
    })
  );

module.exports = router;
