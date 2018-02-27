import {RECOMMEND_REQUEST, RECOMMEND_RESPONSE} from './recommend.reducer';
import {BOOKS_REQUEST} from './books.reducer';
import request from 'superagent';
import {getLeavesMap} from '../utils/taxonomy';
import {filters} from './filter.reducer';
import librarianRecommends from '../../data/librarian-recommends.json';
import {uniq} from 'lodash';
const tagsMap = getLeavesMap(filters);

const fetchRecommendations = async ({tags = [], creators, max}) => {
  let nonCustomTags = tags.filter(tag => !tagsMap[tag].custom);
  if (nonCustomTags.length === 0) {
    // hack alert
    // if no non custom tags are selected - for instance if only short books are selected
    // we just pick one in order to not get an empty list.

    nonCustomTags = [5642]; // varme bøger
  }

  const recompassResponse = (await request
    .get('/v1/recompass')
    .query({tags: nonCustomTags, creators, maxresults: max})).body.response;
  let pids = recompassResponse.map(entry => entry.pid);

  if (tags.includes(-2)) {
    // recompass knows nothing about librarian recommendations, so we gotta include those pids as well
    pids = uniq([...pids, ...librarianRecommends]);
  }

  return pids;
};

export const recommendMiddleware = store => next => action => {
  switch (action.type) {
    case RECOMMEND_REQUEST: {
      (async () => {
        try {
          const pids = await fetchRecommendations(action);
          if (pids.length > 0) {
            store.dispatch({type: BOOKS_REQUEST, pids});
          }
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
