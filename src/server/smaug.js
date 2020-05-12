'use strict';

const config = require('server/config');
const request = require('superagent');
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 60 * 60 * 4}); // Time to live is 4 hours

const fetchAnonymousTokenForClient = async (clientId, clientSecret) => {
  const key = `anonymous_token${clientId}${clientSecret}`;
  let anonymous_token = cache.get(key);
  if (!anonymous_token) {
    anonymous_token = (
      await request
        .post(config.auth.url + '/oauth/token')
        .auth(clientId, clientSecret)
        .send('grant_type=password&username=@&password=@')
    ).body;
    cache.set(key, anonymous_token);
  }
  return anonymous_token;
};

const fetchAnonymousToken = async () => {
  const anonymous_token = await fetchAnonymousTokenForClient(
    config.auth.id,
    config.auth.secret
  );
  return anonymous_token;
};

const fetchConfiguration = async token => {
  const configuration = (
    await request
      .get(config.auth.configurationUrl + '/configuration')
      .query({token})
  ).body;
  return configuration;
};

module.exports = {
  fetchAnonymousToken,
  fetchAnonymousTokenForClient,
  fetchConfiguration
};
