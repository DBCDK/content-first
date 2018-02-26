const defaultState = {
  pids: [],
  isLoading: false,
  books: []
};

export const BOOKS_REQUEST = 'BOOKS_REQUEST';
export const BOOKS_RESPONSE = 'BOOKS_RESPONSE';

const booksReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BOOKS_REQUEST:
      return Object.assign({}, state, {pids: [action.pids]}, {isLoading: true});
    case BOOKS_RESPONSE:
      return Object.assign(
        {},
        state,
        {books: action.response},
        {isLoading: false}
      );
    default:
      return state;
  }
};

export default booksReducer;
