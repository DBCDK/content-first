/**
 * Utillties for backend service manipulation of tags data.
 */

'use strict';
const validatingInput = require('server/json-verifiers').validatingInput;

function parsingTagsInjection (obj) {
  return new Promise((resolve, reject) => {
    return validatingInput(obj, 'schemas/tags-in.json')
      .then(document => {
        let tags = {};
        tags.pid = document.pid;
        tags.tags = [];
        document.selected.forEach(tag => {
          tags.tags.push(parseInt(tag, 10));
        });
        resolve(tags);
      })
      .catch(reject);
  });
}
exports.parsingTagsInjection = parsingTagsInjection;
