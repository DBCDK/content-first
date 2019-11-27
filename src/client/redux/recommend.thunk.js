import request from 'superagent';
import {filtersMapAll} from './filter.reducer';
import {RECOMMEND_REQUEST, RECOMMEND_RESPONSE} from './recommend';
import {BOOKS_PARTIAL_UPDATE} from './books.reducer';

const applyClientSideFilter = (work, tags) => {
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
  return true;
};

const fetchRecommendations = async action => {
  const recommender = action.tags ? 'recompasTags' : 'recompasWork';
  const query = {recommender, agencyId: action.agencyId, branch: action.branch};

  let customTagsSelected = true;
  // let thresholdLevel = 0;  // Disabled until further investigated - see US1058
  if (action.tags) {
    const {tags = [], creators = [], limit} = action;

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
    // thresholdLevel = Math.floor(Math.sqrt(Object.keys(tagsMap).length));  // Disabled until further investigated - see US1058
    query.tags = tagsMap;
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
    let pids = recompassResponse.response.filter(entry => {
      // if custom tags selected move values less than 1
      if (customTagsSelected) {
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
  requestKey
}) => async dispatch => {
  try {
    dispatch({type: RECOMMEND_REQUEST, requestKey});
    const response = await fetchRecommendations({
      tags,
      creators,
      branch,
      agencyId,
      limit
    });

    dispatch({
      type: RECOMMEND_RESPONSE,
      requestKey,
      pids: response.response
        .filter(entry => applyClientSideFilter(entry.work, tags))
        .map(entry => entry.pid),
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
