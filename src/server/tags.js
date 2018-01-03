/**
 * Utillties for backend-service manipulation of tags data.
 */

'use strict';
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/tags-in.json');

function parsingTagsInjection(obj) {
  return new Promise((resolve, reject) => {
    return validatingInput(obj, schema)
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
