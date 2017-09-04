'use strict';

const constants = {
  books: {
    table: 'books'
  },
  covers: {
    table: 'covers'
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
