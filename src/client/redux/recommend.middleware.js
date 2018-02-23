import {RECOMMEND_REQUEST, RECOMMEND_RESPONSE} from './recommend.reducer';
import request from 'superagent';

const fetchRecommendations = async ({tags, creators, max}) => {
  return (await request
    .get('/v1/recompass')
    .query({tags, creators, maxresults: max})).body.response;
};

export const recommendMiddleware = store => next => action => {
  switch (action.type) {
    case RECOMMEND_REQUEST: {
      (async () => {
        try {
          const pids = (await fetchRecommendations(action)).map(
            entry => entry.pid
          );
          store.dispatch({
            ...action,
            type: RECOMMEND_RESPONSE,
            pids
          });
        } catch (error) {
          store.dispatch({
            ...action,
            type: RECOMMEND_RESPONSE,
            error
          });
        }
      })();
      return next(action);
    }
    default:
      return next(action);
  }
};
