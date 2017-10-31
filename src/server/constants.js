/**
 * Constants used by multiple parts of the backend.
 */

'use strict';

const constants = {
  apiversion: '1',
  pages: {
    start: '/',
    generalError: '/general-error'
  },
  books: {
    table: 'books'
  },
  covers: {
    table: 'covers'
  },
  tags: {
    table: 'tags'
  },
  taxonomy: {
    topTable: 'taxonomy_top',
    middleTable: 'taxonomy_middle',
    bottomTable: 'taxonomy_bottom'
  },
  users: {
    table: 'users'
  },
  cookies: {
    table: 'cookies'
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
