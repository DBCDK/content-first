import {mergeWith, uniqBy, isArray} from 'lodash';

/* custom merger for merging tags from both metakompas and from subjects */
const mergeCustomizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return uniqBy(objValue.concat(srcValue), 'id');
  }
};

const defaultState = {
  books: {}
};

export const BOOKS_REQUEST = 'BOOKS_REQUEST';
export const BOOKS_RESPONSE = 'BOOKS_RESPONSE';

export const BOOKS_PARTIAL_UPDATE = 'BOOKS_PARTIAL_UPDATE';

const booksReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BOOKS_PARTIAL_UPDATE: {
      const books = {...state.books};
      action.books.forEach(b => {
        const pid = b.book.pid;
        books[pid] = mergeWith({}, books[pid], b, mergeCustomizer);
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
