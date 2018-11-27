export const FETCH_STATS = 'FETCH_STATS';
export const FETCH_STATS_SUCCESS = 'FETCH_STATS_SUCCESS';
export const FETCH_STATS_ERROR = 'FETCH_STATS_ERROR';

const defaultState = {
  books: {total: 0}
};

const statsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_STATS:
      return {
        isLoading: true
      };

    case FETCH_STATS_SUCCESS: {
      return {
        ...action.stats,
        isLoading: false
      };
    }

    case FETCH_STATS_ERROR: {
      return {
        error: action.error,
        isLoading: false
      };
    }

    default:
      return state;
  }
};

export default statsReducer;
