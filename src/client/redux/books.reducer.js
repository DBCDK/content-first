import {merge} from 'lodash';

const defaultState = {
  books: {}
};

export const BOOKS_REQUEST = 'BOOKS_REQUEST';
export const BOOKS_RESPONSE = 'BOOKS_RESPONSE';
export const REVIEW_REQUEST = 'REVIEW_REQUEST';
export const REVIEW_RESPONSE = 'REVIEW_RESPONSE';
export const COLLECTION_REQUEST = 'COLLECTION_REQUEST';
export const COLLECTION_RESPONSE = 'COLLECTION_RESPONSE';

const booksReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BOOKS_REQUEST: {
      const books = {...state.books};
      action.pids.forEach(pid => {
        books[pid] = {isLoading: true};
      });
      return Object.assign({}, state, {books});
    }
    case BOOKS_RESPONSE: {
      const books = {...state.books};

      action.response.forEach(b => {
        const pid = b.book.pid;
        books[pid] = merge({}, books[pid], b, {isLoading: false});
      });

      return Object.assign({}, state, {books: books});
    }
    case REVIEW_REQUEST: {
      const books = {...state.books};
      const pid = action.pid;

      if (books[pid].book.reviews) {
        books[pid].book.reviews.isLoading = true;
        return Object.assign({}, state, {books});
      }
    }
    case REVIEW_RESPONSE: {
      const books = {...state.books};
      const pid = action.pid;

      if (action.response) {
        books[pid].book.reviews.data = action.response;
        books[pid].book.reviews.isLoading = false;
      }
      return Object.assign({}, state, {books});
    }
    case COLLECTION_REQUEST: {
      const books = {...state.books};
      const pid = action.pid;

      if (books[pid].book.collection) {
        books[pid].book.collection.isLoading = true;
        return Object.assign({}, state, {books});
      }
    }
    case COLLECTION_RESPONSE: {
      const books = {...state.books};
      const pid = action.pid;

      if (action.response) {
        books[pid].book.collection.data = action.response;
        books[pid].book.collection.isLoading = false;
      }
      return Object.assign({}, state, {books});
    }
    default:
      return state;
  }
};

export const getBooks = (state, pids) => {
  return pids.map(p => state.books[p]).filter(b => b);
};

export default booksReducer;
