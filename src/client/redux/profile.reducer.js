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
      {label: 'charmerende', image: '/moods/charmerende.jpg'},
      {label: 'dramatisk', image: '/moods/dramatisk.jpg'},
      {label: 'erotisk', image: '/moods/erotisk.jpg'},
      {label: 'fantasifuld', image: '/moods/fantasifuld.jpg'},
      {label: 'frygtelig', image: '/moods/frygtelig.jpg'},
      {label: 'intellektuel', image: '/moods/intellektuel.jpg'},
      {label: 'kompleks', image: '/moods/kompleks.jpg'},
      {label: 'konventionel', image: '/moods/konventionel.jpg'}
    ],
    archetypes: [
      {
        label: 'romantikeren',
        image: '/moods/charmerende.jpg',
        tags: ['charmerende', 'erotisk'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        follows: ['Agatha Christie']
      }
    ]
  }
};

export const ON_ADD_PROFILE_TAG = 'ON_ADD_PROFILE_TAG';
export const ON_REMOVE_PROFILE_TAG = 'ON_REMOVE_PROFILE_TAG';
export const ON_ADD_PROFILE_ARCHETYPE = 'ON_ADD_PROFILE_ARCHETYPE';
export const ON_REMOVE_PROFILE_ARCHETYPE = 'ON_REMOVE_PROFILE_ARCHETYPE';
export const ON_PROFILE_RECOMMENDATIONS_REQUEST = 'ON_PROFILE_RECOMMENDATIONS_REQUEST';
export const ON_PROFILE_RECOMMENDATIONS_RESPONSE = 'ON_PROFILE_RECOMMENDATIONS_RESPONSE';
export const ON_USER_DETAILS_REQUEST = 'ON_USER_DETAILS_REQUEST';
export const ON_USER_DETAILS_RESPONSE = 'ON_USER_DETAILS_RESPONSE';

const profileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_ADD_PROFILE_TAG:
      return Object.assign({}, state, {tags: [...state.tags, action.tag]});
    case ON_REMOVE_PROFILE_TAG:
      return Object.assign({}, state, {tags: state.tags.filter(tag => tag !== action.tag)});
    case ON_ADD_PROFILE_ARCHETYPE: {
      const tags = action.archetype.tags.filter(tag => !state.tags.includes(tag));
      return Object.assign({}, state, {tags: [...state.tags, ...tags]});
    }
    case ON_REMOVE_PROFILE_ARCHETYPE:
      return Object.assign({}, state);
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
