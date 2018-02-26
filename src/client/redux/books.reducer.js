const defaultState = {
  pids: [],
  isLoading: false,
  books: {}
};

export const BOOKS_REQUEST = 'BOOKS_REQUEST';
export const BOOKS_RESPONSE = 'BOOKS_RESPONSE';

const booksReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BOOKS_REQUEST:
      return Object.assign({}, state, {pids: [action.pids]}, {isLoading: true});
    case BOOKS_RESPONSE:
      const books = {...state.books};

      console.log(action.response);

      action.response.forEach(b => {
        books[b.book.pid] = b;
      });

      return Object.assign({}, state, {books: books}, {isLoading: false});
    default:
      return state;
  }
};

export const getBooks = (state, pids) => {
  return pids.map(p => state.books[p]);
};

export default booksReducer;
