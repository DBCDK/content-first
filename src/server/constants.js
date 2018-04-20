/**
 * Constants used by multiple parts of the backend.
 */

'use strict';

const constants = {
  apiversion: '1',
  books: {
    table: 'books'
  },
  cookies: {
    table: 'cookies'
  },
  covers: {
    table: 'covers'
  },
  lists: {
    table: 'lists',
    defaultLimit: 10
  },
  pages: {
    start: '/replay',
    loggedOut: '/',
    generalError: '/general-error'
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
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
