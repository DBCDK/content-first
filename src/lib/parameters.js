'use strict';

const _ = require('lodash');

/**
 * Parses a list of the form "1,2,3" or "1+2+3".
 * @param  {string} data Eg. "A,B,C"
 * @return {array}       ['A','B','C'] or null
 */
function parseList(data) {
  if (!data || data.length === 0) {
    return null;
  }
  let listComma = _.split(data, ',');
  let listPlus = _.split(data, '+');
  if (!listComma && !listPlus) {
    return null;
  }
  if (listComma.length > listPlus.length) {
    return listComma;
  }
  return listPlus;
}

module.exports = {
  parseList
};
