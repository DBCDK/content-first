import {merge, get} from 'lodash';

const defaultState = {
  books: {}
};

function mergeTags(oldTags, newTags) {
  const result = {};

  oldTags.forEach(tag => (result[tag.id] = tag));
  newTags.forEach(tag => {
    if (!result[tag.id] || tag.score) {
      result[tag.id] = tag;
    }
  });

  return Object.values(result);
}

export const BOOKS_REQUEST = 'BOOKS_REQUEST';
export const BOOKS_RESPONSE = 'BOOKS_RESPONSE';

export const BOOKS_PARTIAL_UPDATE = 'BOOKS_PARTIAL_UPDATE';

const booksReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BOOKS_PARTIAL_UPDATE: {
      const books = {...state.books};
      action.books.forEach(b => {
        const pid = b.book.pid;
        const oldTags = get(books[pid], 'book.tags', []);
        const newTags = get(b, 'book.tags', []);

        books[pid] = merge({}, books[pid], b, {
          book: {tags: mergeTags(oldTags, newTags)}
        });
      });
      return Object.assign({}, state, {books: books});
    }
    default:
      return state;
  }
};

export const getBooks = (state, pids) => {
  return pids.map(p => state.books[p]).filter(b => b);
};

export default booksReducer;
