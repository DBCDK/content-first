const defaultState = {
  tags: [],
  recommendations: [],
  loadingRecommendations: false
};

export const ON_ADD_PROFILE_TAG = 'ON_ADD_PROFILE_TAG';
export const ON_REMOVE_PROFILE_TAG = 'ON_REMOVE_PROFILE_TAG';
export const ON_PROFILE_RECOMMENDATIONS_REQUEST = 'ON_PROFILE_RECOMMENDATIONS_REQUEST';
export const ON_PROFILE_RECOMMENDATIONS_RESPONSE = 'ON_PROFILE_RECOMMENDATIONS_RESPONSE';

const profileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_ADD_PROFILE_TAG:
      return Object.assign({}, state, {tags: state.tags.concat([action.tag])});
    case ON_REMOVE_PROFILE_TAG:
      return Object.assign({}, state, {tags: state.tags.filter(({label}) => label !== action.tag.label)});
    case ON_PROFILE_RECOMMENDATIONS_REQUEST:
      return Object.assign({}, state, {loadingRecommendations: true});
    case ON_PROFILE_RECOMMENDATIONS_RESPONSE:
      return Object.assign({}, state, {recommendations: action.recommendations, loadingRecommendations: false});
    default:
      return state;
  }
};

export default profileReducer;
