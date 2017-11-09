const defaultState = {
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

const profileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_ADD_PROFILE_TAG:
      return Object.assign({}, state, {tags: state.tags.concat([action.tag])});
    case ON_REMOVE_PROFILE_TAG:
      return Object.assign({}, state, {tags: state.tags.filter(({label}) => label !== action.tag.label)});
    default:
      return state;
  }
};

export default profileReducer;
