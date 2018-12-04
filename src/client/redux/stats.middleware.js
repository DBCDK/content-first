import {fetchStats} from '../utils/requester';
import {
  FETCH_STATS,
  FETCH_STATS_ERROR,
  FETCH_STATS_SUCCESS
} from './stats.reducer';

export const statsMiddleware = store => next => action => {
  switch (action.type) {
    case FETCH_STATS:
      return (async () => {
        next(action);
        try {
          const stats = await fetchStats();
          store.dispatch({
            type: FETCH_STATS_SUCCESS,
            stats
          });
        } catch (error) {
          store.dispatch({
            type: FETCH_STATS_ERROR,
            error
          });
        }
      })();

    default:
      return next(action);
  }
};
