import {createSelector} from 'reselect';
import librarianRecommends from '../../data/librarian-recommends.json';
import request from 'superagent';
import {uniq, difference, isEqual} from 'lodash';
import {filtersMapAll} from './filter.reducer';
import {BOOKS_REQUEST} from './books.reducer';

const librarianRecommendsMap = librarianRecommends.reduce((map, pid) => {
  map[pid] = true;
  return map;
}, {});

const defaultState = {
  recommendations: {},
  workRecommendations: {}
};

export const TAGS_RECOMMEND_REQUEST = 'TAGS_RECOMMEND_REQUEST';
export const TAGS_RECOMMEND_RESPONSE = 'TAGS_RECOMMEND_RESPONSE';

export const WORK_RECOMMEND_REQUEST = 'WORK_RECOMMEND_REQUEST';
export const WORK_RECOMMEND_RESPONSE = 'WORK_RECOMMEND_RESPONSE';

const key = argList => {
  let res = '';
  if (argList) {
    const argListCopy = [...argList];
    argListCopy.sort();
    res += argListCopy.join('-');
  }
  return res;
};

const recommendReducer = (state = defaultState, action) => {
  switch (action.type) {
    case TAGS_RECOMMEND_REQUEST:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [key([...(action.tags || []), ...(action.creators || [])])]: {
            isLoading: true,
            pids: []
          }
        }
      };

    case TAGS_RECOMMEND_RESPONSE:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [key([...(action.tags || []), ...(action.creators || [])])]: {
            isLoading: false,
            pids: action.pids || [],
            rid: action.rid,
            error: action.error
          }
        }
      };

    case WORK_RECOMMEND_REQUEST:
      return {
        ...state,
        workRecommendations: {
          ...state.workRecommendations,
          [key(action.likes)]: {isLoading: true, pids: []}
        }
      };

    case WORK_RECOMMEND_RESPONSE:
      return {
        ...state,
        workRecommendations: {
          ...state.workRecommendations,
          [key(action.likes)]: {
            isLoading: false,
            pids: action.pids || [],
            rid: action.rid,
            error: action.error
          }
        }
      };
    default:
      return state;
  }
};

const emptyResponse = {isLoading: false, pids: []};
export const createGetRecommendedPids = () => {
  let prevRecommendations;
  return createSelector(
    [
      (state, {tags}) => {
        /* Because of client side filters, we have to do some work here
        We apply the client side filters, make a deep equal to the prev result,
        and only return a new object if it has changed.
        All this, because we don't want components to re-render every time a
        work is updated.. */
        const recommendations =
          state.recommendReducer.recommendations[key([...tags])] ||
          emptyResponse;
        const recommendationsCopy = {...recommendations};
        recommendationsCopy.pids = recommendationsCopy.pids
          .map(pid => {
            const work = state.booksReducer.books[pid];
            if (work && !work.isLoading) {
              if (applyClientSideFilter(work, tags)) {
                return pid;
              }
              return null;
            }
            return pid;
          })
          .filter(pid => pid);
        if (isEqual(prevRecommendations, recommendationsCopy)) {
          return prevRecommendations;
        }
        prevRecommendations = recommendationsCopy;
        return recommendationsCopy;
      },
      (state, {excluded}) => excluded,
      (state, {limit}) => limit
    ],
    (recommendations, excluded, limit = 20) => {
      return {
        ...recommendations,
        pids: difference(recommendations.pids, excluded).slice(0, limit)
      };
    }
  );
};

export const createWorkRecommendedPids = () =>
  createSelector(
    [
      (state, {likes}) =>
        state.recommendReducer.workRecommendations[key(likes)] || emptyResponse,
      (state, {excluded}) => excluded
    ],
    (recommendations, excluded) => {
      recommendations.pids = difference(recommendations.pids, excluded).slice(
        0,
        20
      );
      return recommendations;
    }
  );

export const getRecommendedPids = (state, {tags = [], creators = []}) => {
  const k = key([...tags, ...creators]);
  return state.recommendations[k] || {isLoading: false, pids: []};
};

export const getWorkRecommendedPids = (state, {likes}) => {
  const k = key(likes);
  return state.workRecommendations[k] || {isLoading: false, pids: []};
};

export const applyClientSideFilters = (books, tags) => {
  return books.filter(work => {
    return applyClientSideFilter(work, tags);
  });
};

export const applyClientSideFilter = (work, tags) => {
  let minPages = 0;
  let maxPages = 500000;

  if (!work) {
    return false;
  }
  // step1: check if short tag is selected
  if (tags.includes(100000)) {
    // short book
    maxPages = 150;
  }
  // step2: check if medium tag is selected
  if (tags.includes(100001)) {
    // medium length book
    maxPages = 350;
    minPages = 150;
    if (tags.includes(100000)) {
      minPages = 0;
    }
  }
  // step3: check if long tag is selected
  if (tags.includes(100002)) {
    maxPages = 500000;
    minPages = 350;
    if (tags.includes(100001)) {
      minPages = 150;
    }
    if (tags.includes(100000)) {
      minPages = 0;
    }
  }

  // step4: filter by min and max pages.
  if (
    work.book.pages &&
    work.book.pages !== 0 &&
    (work.book.pages <= minPages || work.book.pages >= maxPages)
  ) {
    return false;
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
};

const fetchRecommendations = async action => {
  const recommender = action.tags ? 'recompasTags' : 'recompasWork';
  const query = {recommender};
  let customTagsSelected = true;
  let thresholdLevel = 0;
  if (action.tags) {
    const {tags = [], creators = [], max = 50} = action;

    let nonCustomTags = tags.filter(
      tag => !filtersMapAll[tag.id || tag].custom
    );

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
    thresholdLevel = Math.floor(Math.sqrt(Object.keys(tagsMap).length));
    query.tags = tagsMap;
    query.maxresults = max;
    query.creators = creators;
  } else {
    const {likes = [], dislikes = [], limit = 50} = action;

    query.likes = JSON.stringify(likes);
    query.dislikes = JSON.stringify(dislikes);
    query.limit = limit;
  }

  // recompas backend call
  const recompassResponse = (await request.get('/v1/recompass').query(query))
    .body;

  if (action.tags) {
    let pids = recompassResponse.response
      .filter(entry => {
        // if custom tags selected move values less than 1
        if (customTagsSelected) {
          return entry.value;
        }
        return true;
      })
      .filter(entry => entry.value >= thresholdLevel)
      .map(entry => entry.pid);

    if (action.tags.includes(-2)) {
      // recompass knows nothing about librarian recommendations, so we gotta include those pids as well
      pids = uniq([...pids, ...librarianRecommends]);
    }
    recompassResponse.response = pids;
  }
  return recompassResponse;
};

export const recommendMiddleware = store => next => action => {
  switch (action.type) {
    case TAGS_RECOMMEND_REQUEST: {
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
            const body = await fetchRecommendations(action);
            const pids = body.response;
            const rid = body.rid;
            store.dispatch({
              ...action,
              type: TAGS_RECOMMEND_RESPONSE,
              pids,
              rid
            });
            let containsClientSideTags = false;
            action.tags.forEach(tag => {
              if (tag >= 100000 || tag.id >= 100000) {
                containsClientSideTags = true;
              }
            });
            if (containsClientSideTags) {
              store.dispatch({
                type: BOOKS_REQUEST,
                pids,
                includeCover: false
              });
            }
          } catch (error) {
            store.dispatch({
              ...action,
              type: TAGS_RECOMMEND_RESPONSE,
              error
            });
          }
        })();
        return next(action);
      }
      return;
    }
    case WORK_RECOMMEND_REQUEST: {
      const workRecommendations = getWorkRecommendedPids(
        store.getState().recommendReducer,
        {
          likes: action.likes
        }
      );
      if (
        !workRecommendations.isLoading &&
        workRecommendations.pids.length === 0
      ) {
        (async () => {
          try {
            const body = await fetchRecommendations(action);
            const pids = body.response.map(w => w.pid);
            const rid = body.rid;
            store.dispatch({
              ...action,
              type: WORK_RECOMMEND_RESPONSE,
              pids,
              rid
            });
          } catch (error) {
            store.dispatch({
              ...action,
              type: WORK_RECOMMEND_RESPONSE,
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
