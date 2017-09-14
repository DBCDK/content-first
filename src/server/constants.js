/**
 * Constants used by multiple parts of the backend.
 */

'use strict';

const constants = {
  apiversion: '1',
  books: {
    table: 'books'
  },
  covers: {
    table: 'covers'
  },
  tags: {
    table: 'tags'
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
