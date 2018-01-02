export const SEARCH_QUERY = 'SEARCH_QUERY';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';

const defaultState = {
  loading: false,
  query: '',
  results: null
};

const searchReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_QUERY:
      return {
        ...state,
        loading: true,
        results: null,
        query: action.query
      };
    case SEARCH_RESULTS:
      return {
        ...state,
        loading: false,
        results: action.results,
        query: action.query
      };
    default:
      return state;
  }
};

export default searchReducer;
