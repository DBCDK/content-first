'use strict';

const _ = require('lodash');

function parseList (data) {
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
exports.parseList = parseList;
