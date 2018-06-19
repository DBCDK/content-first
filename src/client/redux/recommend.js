import librarianRecommends from '../../data/librarian-recommends.json';
import {BOOKS_REQUEST} from './books.reducer';
import request from 'superagent';
import {uniq} from 'lodash';
import {filtersMapAll} from './filter.reducer';

const librarianRecommendsMap = librarianRecommends.reduce((map, pid) => {
  map[pid] = true;
  return map;
}, {});

const defaultState = {
  recommendations: {}
};

export const RECOMMEND_REQUEST = 'RECOMMEND_REQUEST';
export const RECOMMEND_RESPONSE = 'RECOMMEND_RESPONSE';

const key = (tags, creators) => {
  let res = '';
  if (tags) {
    const tagsCopy = [...tags];
    tagsCopy.sort();
    res += tagsCopy.join('-');
  }
  if (creators) {
    const creatorsCopy = [...creators];
    creatorsCopy.sort();
    res += creatorsCopy.join('-');
  }
  return res;
};
const recommendReducer = (state = defaultState, action) => {
  switch (action.type) {
    case RECOMMEND_REQUEST:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [key(action.tags, action.creators)]: {isLoading: true, pids: []}
        }
      };
    case RECOMMEND_RESPONSE:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [key(action.tags, action.creators)]: {
            isLoading: false,
            pids: action.pids || [],
            error: action.error
          }
        }
      };
    default:
      return state;
  }
};

export const getRecommendedPids = (state, {tags, creators}) => {
  const k = key(tags, creators);
  return state.recommendations[k] || {isLoading: false, pids: []};
};

export const applyClientSideFilters = (books, tags) => {
  return books.filter(work => {
    if (!work) {
      return false;
    }
    if (tags.includes(100000)) {
      // short book
      if (work.book.pages > 150) {
        return false;
      }
    }
    if (tags.includes(100001)) {
      // medium length book
      if (work.book.pages <= 150 || work.book.pages > 350) {
        return false;
      }
    }
    if (tags.includes(100002)) {
      // long length book
      if (work.book.pages <= 350) {
        return false;
      }
    }
    if (tags.includes(100003)) {
      // availability
      if (work.book.libraries < 50) {
        return false;
      }
    }
    if (tags.includes(100005)) {
      // popularity
      if (work.book.loans < 100) {
        return false;
      }
    }
    if (tags.includes(-2)) {
      if (!librarianRecommendsMap[work.book.pid]) {
        return false;
      }
    }
    return true;
  });
};

const fetchRecommendations = async ({tags = [], creators, max}) => {
  let nonCustomTags = tags.filter(tag => !filtersMapAll[tag.id || tag].custom);
  let customTagsSelected = true;
  if (nonCustomTags.length === 0) {
    // hack alert
    // if no non custom tags are selected - for instance if only short books are selected
    // we just pick one in order to not get an empty list.

    nonCustomTags = [5642]; // varme bøger
    customTagsSelected = false;
  }

  const tagsMap = nonCustomTags.reduce((tMap, t) => {
    if (t.weight) {
      return {...tMap, [t.id]: t.weight};
    }
    return {...tMap, [t]: 1};
  }, {});

  const recompassResponse = (await request
    .get('/v1/recompass')
    .query({tags: tagsMap, creators, maxresults: max})).body.response;

  let pids = recompassResponse
    .filter(entry => {
      // if custom tags selected move values less than 1
      if (customTagsSelected) {
        return entry.value;
      }
      return true;
    })
    .map(entry => entry.pid);

  if (tags.includes(-2)) {
    // recompass knows nothing about librarian recommendations, so we gotta include those pids as well
    pids = uniq([...pids, ...librarianRecommends]);
  }

  return pids;
};

export const recommendMiddleware = store => next => action => {
  switch (action.type) {
    case RECOMMEND_REQUEST: {
      const recommendations = getRecommendedPids(
        store.getState().recommendReducer,
        {
          tags: action.tags,
          creators: action.creators
        }
      );
      if (!recommendations.isLoading && recommendations.pids.length === 0) {
        (async () => {
          try {
            const pids = await fetchRecommendations(action);
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
      return;
    }
    default:
      return next(action);
  }
};

export default recommendReducer;
