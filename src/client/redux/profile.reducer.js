const defaultState = {
  user: {
    isLoading: false,
    isLoggedIn: false
  },
  tags: [],
  recommendations: [],
  loadingRecommendations: false,
  belts: {
    moods: [
      {label: 'charmerende'},
      {label: 'dramatisk'},
      {label: 'erotisk'},
      {label: 'fantasifuld'},
      {label: 'frygtelig'},
      {label: 'intellektuel'},
      {label: 'kompleks'},
      {label: 'konventionel'}
    ]
  }
};

export const ON_ADD_PROFILE_TAG = 'ON_ADD_PROFILE_TAG';
export const ON_REMOVE_PROFILE_TAG = 'ON_REMOVE_PROFILE_TAG';
export const ON_PROFILE_RECOMMENDATIONS_REQUEST = 'ON_PROFILE_RECOMMENDATIONS_REQUEST';
export const ON_PROFILE_RECOMMENDATIONS_RESPONSE = 'ON_PROFILE_RECOMMENDATIONS_RESPONSE';
export const ON_USER_DETAILS_REQUEST = 'ON_USER_DETAILS_REQUEST';
export const ON_USER_DETAILS_RESPONSE = 'ON_USER_DETAILS_RESPONSE';

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
    case ON_USER_DETAILS_REQUEST:
      return Object.assign({}, state, {user: Object.assign({}, state.user, {isLoading: true})});
    case ON_USER_DETAILS_RESPONSE:
      if (!action.user) {
        return Object.assign({}, state, {user: defaultState.user});
      }
      return Object.assign({}, state, {user: Object.assign({}, action.user, {isLoading: false})});
    default:
      return state;
  }
};

export default profileReducer;
