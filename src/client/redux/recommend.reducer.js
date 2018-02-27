import librarianRecommends from '../../data/librarian-recommends.json';
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

export default recommendReducer;
