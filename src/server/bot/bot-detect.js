// Bot List
const BOTS = require('./bot-list');

/**
 * Express middleware
 * @param options Partial<Options>
 * @returns {Function}
 * @example
 *
 * app.use(require('express-bot')({
 *   querystring: { // dicision using querystring  https://localhost?bot=1 -> hit!!
 *     use: true,
 *     key: 'bot',
 *     value: '1',
 *   },
 *   additionalBots: [ // list of UA strings to be added to pre-defined BOTS.
 *     'MinorBot'
 *   ]
 * }));
 */

const defaultQueryString = {
  use: true,
  // tslint:disable-next-line: object-literal-sort-keys
  key: 'bot',
  value: '1',
  locals: {}
};

const defaultOptions = {
  additionalBots: [],
  querystring: {}
};

const defaultAdditionalBots = [];

const expressBot = (options = {}) => {
  const opts = {...defaultOptions, ...options};
  const querystring = {...defaultQueryString, ...opts.querystring};
  const additionalBots = [...defaultAdditionalBots, ...opts.additionalBots];

  let bots = BOTS;
  if (0 < additionalBots.length) {
    bots = Array.prototype.concat(bots, additionalBots);
  }

  const botRegExp = new RegExp('^.*(' + bots.join('|') + ').*$', 'i');

  return (req, res, next) => {
    if (
      querystring.use &&
      req.query[querystring.key] &&
      req.query[querystring.key] === querystring.value
    ) {
      res.locals[querystring.key] = querystring.locals;
      next();
      return;
    }

    const ua = req.headers['user-agent'] || '';
    const decision = ua.match(botRegExp);

    if (decision) {
      res.locals[querystring.key] = decision;
    }
    next();
  };
};

module.exports = expressBot;
