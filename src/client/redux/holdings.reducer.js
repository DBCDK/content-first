const defaultState = {
  holdings: {}
};

export const FETCH_HOLDINGS = 'FETCH_HOLDINGS';
export const FETCH_HOLDINGS_SUCCESS = 'FETCH_HOLDINGS_SUCCESS';
export const FETCH_HOLDINGS_ERROR = 'FETCH_HOLDINGS_ERROR';

const holdingsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_HOLDINGS: {
      if (!action.pid) {
        throw new Error("'pid' is missing from action");
      }
      const newState = {holdings: {...state.holdings}};
      newState.holdings[action.pid] = {isFetching: true};
      return newState;
    }

    case FETCH_HOLDINGS_SUCCESS: {
      if (!action.pid) {
        throw new Error("'pid' is missing from action");
      }
      const newState = {holdings: {...state.holdings}};
      newState.holdings[action.pid] = {
        holdings: [...action.holdings],
        isFetching: false
      };
      return newState;
    }

    case FETCH_HOLDINGS_ERROR: {
      const newState = {holdings: {...state.holdings}};
      newState.holdings[action.pid] = {error: action.error, isFetching: false};
      return newState;
    }
    default:
      return state;
  }
};

export default holdingsReducer;
