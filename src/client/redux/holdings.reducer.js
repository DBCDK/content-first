const defaultState = {};

export const FETCH_HOLDINGS = 'FETCH_HOLDINGS';
export const FETCH_HOLDINGS_SUCCESS = 'FETCH_HOLDINGS_SUCCESS';
export const FETCH_HOLDINGS_ERROR = 'FETCH_HOLDINGS_ERROR';

const holdingsReducer = (state = defaultState, action) => {
  const timestamp = new Date().getTime();
  switch (action.type) {
    case FETCH_HOLDINGS: {
      if (!action.pids) {
        throw new Error("'pids' is missing from action");
      }
      const newState = {...state};
      action.pids.forEach(pid => {
        newState[pid] = {timestamp, isFetching: true};
      });

      return newState;
    }

    case FETCH_HOLDINGS_SUCCESS: {
      if (!action.holdings) {
        throw new Error("'holdings' is missing from action");
      }
      const newState = {...state};
      Object.entries(action.holdings).forEach(([pid, holdings]) => {
        newState[pid] = {
          holdings: [...holdings],
          timestamp,
          isFetching: false
        };
      });
      return newState;
    }

    case FETCH_HOLDINGS_ERROR: {
      const newState = {...state};
      action.pids.forEach(pid => {
        newState[pid] = {
          error: action.error,
          holdings: [],
          timestamp,
          isFetching: false
        };
      });
      return newState;
    }

    default:
      return state;
  }
};

export default holdingsReducer;
