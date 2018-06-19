import {BOOKS_REQUEST} from './books.reducer';
import {fetchTagIds} from '../utils/requester';
export const TAGID_REQUEST = 'TAGID_REQUEST';
export const TAGID_RESPONSE = 'TAGID_RESPONSE';

const defaultState = {
  tags: []
};

export const tagIdMiddleware = store => next => action => {
  switch (action.type) {
    case TAGID_REQUEST: {
      const pids = action.pids;

      if (pids.length > 0) {
        (async () => {
          try {
            store.dispatch({type: BOOKS_REQUEST, pids});
            //
            const tags = await fetchTagIds(pids);
            store.dispatch({
              ...action,
              type: TAGID_RESPONSE,
              tags
            });
          } catch (error) {
            store.dispatch({
              ...action,
              type: TAGID_RESPONSE,
              error
            });
          }
        })();
      }
      return next(action);
    }
    default:
      return next(action);
  }
};

const tagIdReducer = (state = defaultState, action) => {
  switch (action.type) {
    case TAGID_REQUEST:
      return {
        ...state
      };
    case TAGID_RESPONSE:
      return {
        ...state,
        tags: action.tags.filter(tag => tag > 0)
      };
    default:
      return state;
  }
};

export default tagIdReducer;
