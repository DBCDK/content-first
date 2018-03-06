const defaultState = {
  books: {}
};

export const BOOKS_REQUEST = 'BOOKS_REQUEST';
export const BOOKS_RESPONSE = 'BOOKS_RESPONSE';

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
        books[b.book.pid] = {...b, isLoading: false};
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
