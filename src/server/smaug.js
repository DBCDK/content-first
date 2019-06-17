'use strict';

const config = require('server/config');
const request = require('superagent');
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 60 * 60 * 4}); // Time to live is 4 hours

const fetchAnonymousToken = async () => {
  let anonymous_token = cache.get('anonymous_token');
  if (!anonymous_token) {
    anonymous_token = (await request
      .post(config.auth.url + '/oauth/token')
      .auth(config.auth.id, config.auth.secret)
      .send('grant_type=password&username=@&password=@')).body;
    cache.set('anonymous_token', anonymous_token);
  }
  return anonymous_token;
};

module.exports = {fetchAnonymousToken};
