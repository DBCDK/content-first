import {merge} from 'lodash';

const defaultState = {
  books: {}
};

export const BOOKS_REQUEST = 'BOOKS_REQUEST';
export const BOOKS_RESPONSE = 'BOOKS_RESPONSE';

export const BOOKS_DETAILS_REQUEST = 'BOOKS_DETAILS_REQUEST';
export const BOOKS_DETAILS_RESPONSE = 'BOOKS_DETAILS_RESPONSE';

export const TAGS_REQUEST = 'TAGS_REQUEST';
export const TAGS_RESPONSE = 'TAGS_RESPONSE';

export const REVIEW_REQUEST = 'REVIEW_REQUEST';
export const REVIEW_RESPONSE = 'REVIEW_RESPONSE';

export const COLLECTION_REQUEST = 'COLLECTION_REQUEST';
export const COLLECTION_RESPONSE = 'COLLECTION_RESPONSE';

const booksReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BOOKS_DETAILS_REQUEST: {
      const books = {...state.books};
      action.pids.forEach(pid => {
        books[pid] = merge({}, books[pid], {isLoading: true});
      });
      return Object.assign({}, state, {books});
    }
    case BOOKS_DETAILS_RESPONSE: {
      const books = {...state.books};
      action.response.forEach(b => {
        const pid = b.book.pid;
        books[pid] = merge({}, books[pid], b, {isLoading: false});
      });
      return Object.assign({}, state, {books: books});
    }
    case TAGS_REQUEST: {
      const books = {...state.books};
      // action.pids.forEach(pid => {
      //   books[pid] = {isLoading: true};
      // });
      return Object.assign({}, state, {books});
    }
    case TAGS_RESPONSE: {
      const books = {...state.books};
      action.response.forEach(b => {
        const pid = b.book.pid;
        books[pid] = merge({}, books[pid], b);
      });
      return Object.assign({}, state, {books: books});
    }
    case REVIEW_REQUEST: {
      const books = {...state.books};
      action.pids.forEach(pid => {
        books[pid] = {
          ...books[pid],
          book: {
            ...books[pid].book,
            reviews: {...books[pid].book.reviews, isLoading: true}
          }
        };
      });
      return Object.assign({}, state, {books});
    }
    case REVIEW_RESPONSE: {
      const books = {...state.books};
      action.response.forEach(b => {
        const pid = b.book.pid;
        books[pid] = merge({}, books[pid], b);
      });
      return Object.assign({}, state, {books: books});
    }
    case COLLECTION_REQUEST: {
      const books = {...state.books};
      action.pids.forEach(pid => {
        books[pid].book.collection.isLoading = true;
      });
      return Object.assign({}, state, {books});
    }
    case COLLECTION_RESPONSE: {
      const books = {...state.books};
      action.response.forEach(b => {
        const pid = b.book.pid;
        books[pid] = merge({}, books[pid], b);
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
