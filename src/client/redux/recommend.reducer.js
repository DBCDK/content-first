const defaultState = {
  recommendations: {}
};

export const RECOMMEND_REQUEST = 'RECOMMEND_REQUEST';
export const RECOMMEND_RESPONSE = 'RECOMMEND_RESPONSE';

const key = (tags, creators) => {
  let res = '';
  if (tags) {
    tags.sort();
    res += tags.join('-');
  }
  if (creators) {
    creators.sort();
    res += creators.join('-');
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
          [key(action.tags, action.creators)]: {isLoading: true}
        }
      };
    case RECOMMEND_RESPONSE:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [key(action.tags, action.creators)]: {
            isLoading: false,
            pids: action.pids,
            error: action.error
          }
        }
      };
    default:
      return state;
  }
};

export const getRecommendations = (state, {tags, creators}) => {
  const k = key(tags, creators);
  return state.recommendations[k];
};

export default recommendReducer;
