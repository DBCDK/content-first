const defaultState = {
  user: {
    isLoading: false,
    isLoggedIn: false
  },
  tags: [],
  recommendations: [
    {pid: '870970-basis:52038014'},
    {pid: '870970-basis:52530423'},
    {pid: '870970-basis:52387078'},
    {pid: '870970-basis:52939321'},
    {pid: '870970-basis:51591046'},
    {pid: '870970-basis:52788226'}
  ]
};

export const ON_ADD_PROFILE_TAG = 'ON_ADD_PROFILE_TAG';
export const ON_REMOVE_PROFILE_TAG = 'ON_REMOVE_PROFILE_TAG';
export const ON_USER_DETAILS_REQUEST = 'ON_USER_DETAILS_REQUEST';
export const ON_USER_DETAILS_RESPONSE = 'ON_USER_DETAILS_RESPONSE';

const profileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_ADD_PROFILE_TAG:
      return Object.assign({}, state, {tags: state.tags.concat([action.tag])});
    case ON_REMOVE_PROFILE_TAG:
      return Object.assign({}, state, {tags: state.tags.filter(({label}) => label !== action.tag.label)});
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
