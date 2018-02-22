const defaultState = {
  books: [
    {
      pid: '870970-basis:52530423',
      position: {x: 13.5, y: 40},
      description: 'lorem ipsum . . .'
    },
    {
      pid: '870970-basis:53079202',
      position: {x: 21.8, y: 44},
      description: 'lorem ipsum . . .'
    },
    {
      pid: '870970-basis:52038014',
      position: {x: 26, y: 46},
      description: 'lorem ipsum . . .'
    },
    {
      pid: '870970-basis:23211629',
      position: {x: 36.5, y: 46},
      description: 'lorem ipsum . . .'
    }
  ]
};

// export const ON_BOOK_REQUEST = 'ON_BOOK_REQUEST';
// export const ON_BOOK_RESPONSE = 'ON_BOOK_RESPONSE';
export const ON_BOOK_REQUEST_TEST = 'ON_BOOK_REQUEST_TEST';

const bookcaseReducer = (state = defaultState, action) => {
  switch (action.type) {
    // case ON_BOOK_REQUEST: {
    //   const books = state.books.map(b => {
    //     if (b.pid === action.pid) {
    //       return Object.assign({}, b);
    //     }
    //     return b;
    //   });
    //   return Object.assign({}, {books});
    // }
    // case ON_BOOK_RESPONSE: {
    //   const books = state.books.map(b => {
    //     if (b.pid === action.pid) {
    //       return Object.assign({}, b, {work: action.response});
    //     }
    //     return b;
    //   });
    //   return Object.assign({}, {books});
    // }
    case ON_BOOK_REQUEST_TEST: {
      return Object.assign({}, {state});
    }

    default:
      return state;
  }
};

export default bookcaseReducer;
