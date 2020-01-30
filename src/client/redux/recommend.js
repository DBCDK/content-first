const defaultState = {
  recommendations: {}
};

export const RECOMMEND_REQUEST = 'RECOMMEND_REQUEST';
export const RECOMMEND_RESPONSE = 'RECOMMEND_RESPONSE';

const recommendReducer = (state = defaultState, action) => {
  switch (action.type) {
    case RECOMMEND_REQUEST:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [action.requestKey]: {
            isLoading: true,
            pids: []
          }
        }
      };

    case RECOMMEND_RESPONSE:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [action.requestKey]: {
            isLoading: !!action.isLoading,
            hasLoaded: true,
            pids: action.pids || [],
            details: [],
            rid: action.rid,
            error: action.error
          }
        }
      };
    default:
      return state;
  }
};

export default recommendReducer;
