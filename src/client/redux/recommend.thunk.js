import request from 'superagent';
import {filtersMapAll} from './filter.reducer';
import {RECOMMEND_REQUEST, RECOMMEND_RESPONSE} from './recommend';
import {BOOKS_PARTIAL_UPDATE} from './books.reducer';
import {flatten, difference} from 'lodash';

const fetchRecommendations = async action => {
  const recommender = action.tags ? 'recompasTags' : 'recompasWork';
  const query = {
    recommender,
    agencyId: action.agencyId,
    branch: action.branch,
    timeout: action.timeout
  };

  // let thresholdLevel = 0;  // Disabled until further investigated - see US1058
  if (action.tags) {
    const {tags = [], creators = [], limit} = action;
    const tagsMap = tags.reduce((tMap, t) => {
      if (t.weight) {
        return {...tMap, [t.id]: t.weight};
      }
      return {...tMap, [t]: 1};
    }, {});

    // thresholdLevel = Math.floor(Math.sqrt(Object.keys(tagsMap).length));  // Disabled until further investigated - see US1058

    query.tags = tagsMap;
    query.plus = action.plusArr;
    query.minus = action.minusArr;
    query.maxresults = limit;
    query.creators = creators;
  } else {
    const {likes = [], dislikes = [], limit, tag_weight} = action;

    query.likes = JSON.stringify(likes);
    query.dislikes = JSON.stringify(dislikes);
    query.limit = limit;
    query.tag_weight = tag_weight;
  }
  // recompas backend call
  const recompassResponse = (await request.get('/v1/recompass').query(query))
    .body;

  if (action.tags) {
    // tags that are not minus filters
    const nonMinusFilters = difference(
      action.tags.map(tag => tag.id || tag),
      Array.isArray(query.minus) ? query.minus : []
    );
    let pids = recompassResponse.response.filter(entry => {
      // if custom tags selected move values less than 1
      // but only if there are tags that are not used as
      // minus filters
      if (nonMinusFilters.length > 0) {
        return entry.value;
      }
      return true;
    });

    recompassResponse.response = pids;
  }
  return recompassResponse;
};

export const fetchTagRecommendations = ({
  tags = [],
  creators = [],
  branch,
  agencyId,
  limit = 20,
  requestKey,
  plus,
  minus
}) => async dispatch => {
  let minusArr = [];
  let plusArr = [];
  if (minus) {
    minusArr = flatten(minus).map(el => Math.trunc(el));
  }
  if (plus) {
    plusArr = flatten(plus).map(el => Math.trunc(el));
  }

  try {
    dispatch({type: RECOMMEND_REQUEST, requestKey});

    if (limit > 20) {
      // Respond fast
      const fastResponse = await fetchRecommendations({
        tags,
        creators,
        branch,
        agencyId,
        limit: 20,
        plusArr,
        minusArr,
        timeout: 2000
      });
      dispatch({
        type: RECOMMEND_RESPONSE,
        requestKey,
        pids: fastResponse.response.map(entry => entry.pid),
        rid: fastResponse.rid,
        isLoading: true
      });
    }

    const response = await fetchRecommendations({
      tags,
      creators,
      branch,
      agencyId,
      limit,
      plusArr,
      minusArr,
      timeout: 10000
    });

    dispatch({
      type: RECOMMEND_RESPONSE,
      requestKey,
      pids: response.response.map(entry => entry.pid),
      rid: response.rid
    });

    dispatch({
      type: BOOKS_PARTIAL_UPDATE,
      books: response.response.map(entry => ({
        ...entry.work,
        detailsHasLoaded: true,
        detailsIsLoading: false
      }))
    });
  } catch (error) {
    dispatch({
      type: RECOMMEND_RESPONSE,
      requestKey,
      error
    });
  }
};

export const fetchWorkRecommendations = ({
  likes = [],
  dislikes = [],
  tag_weight,
  branch,
  agencyId,
  limit = 20,
  requestKey
}) => async dispatch => {
  try {
    dispatch({type: RECOMMEND_REQUEST, requestKey});
    const response = await fetchRecommendations({
      likes,
      dislikes,
      tag_weight,
      branch,
      agencyId,
      limit
    });

    dispatch({
      type: RECOMMEND_RESPONSE,
      requestKey,
      pids: response.response.map(entry => entry.pid),
      rid: response.rid
    });

    dispatch({
      type: BOOKS_PARTIAL_UPDATE,
      books: response.response.map(entry => ({
        ...entry.work,
        detailsHasLoaded: true,
        detailsIsLoading: false
      }))
    });
  } catch (error) {
    dispatch({
      type: RECOMMEND_RESPONSE,
      requestKey,
      error
    });
  }
};
