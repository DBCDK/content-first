import unique from '../utils/unique';

const defaultState = {
  user: {
    isLoading: false,
    isLoggedIn: false
  },
  allSelectedTags: [],
  selectedMoods: [],
  selectedAuthors: [],
  selectedArchetypes: [],
  recommendations: {
    isLoading: false,
    elements: []
  },
  belts: {
    moods: [
      {label: 'Åbent fortolkningsrum', image: '/moods/charmerende.jpg'},
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
        image: '/archetypes/romantikeren.jpg',
        moods: ['fantasifuld', 'erotisk'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        authors: ['Carsten Jensen', 'Hanne Vibeke Holst']
      },
      {
        label: 'hestepigen',
        image: '/archetypes/hestepigen.jpg',
        moods: ['fantasifuld', 'dramatisk'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        authors: ['Anne Lise Marstrand Jørgensen']
      },
      {
        label: 'kynikeren',
        image: '/archetypes/kynikeren.jpg',
        moods: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        authors: ['Kim Leine', 'Paula Hawkins']
      }
    ],
    authors: [
      {
        label: 'Anne Lise Marstrand Jørgensen',
        image: '/authors/anne-lise-marstrand-joergensen.jpg',
        genres: ['fantasifuld', 'erotisk'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        byline: 'about the author'
      },
      {
        label: 'Carsten Jensen',
        image: '/authors/carsten-jensen.jpg',
        genres: ['fantasifuld', 'dramatisk'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        byline: 'about the author'
      },
      {
        label: 'Hanne Vibeke Holst',
        image: '/authors/hanne-vibeke-holst.jpg',
        genres: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        byline: 'about the author'
      },
      {
        label: 'Kim Leine',
        image: '/authors/kim-leine.jpg',
        genres: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        byline: 'about the author'
      },
      {
        label: 'Paula Hawkins',
        image: '/authors/paula-hawkins.jpg',
        genres: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: ['870970-basis:52038014', '870970-basis:52530423', '870970-basis:52939321'],
        byline: 'about the author'
      }
    ]
  }
};

export const ON_ADD_PROFILE_TAG = 'ON_ADD_PROFILE_TAG';
export const ON_REMOVE_PROFILE_TAG = 'ON_REMOVE_PROFILE_TAG';
export const ON_ADD_PROFILE_AUTHOR= 'ON_ADD_PROFILE_AUTHOR';
export const ON_REMOVE_PROFILE_AUTHOR = 'ON_REMOVE_PROFILE_AUTHOR';
export const ON_ADD_PROFILE_ARCHETYPE = 'ON_ADD_PROFILE_ARCHETYPE';
export const ON_REMOVE_PROFILE_ARCHETYPE = 'ON_REMOVE_PROFILE_ARCHETYPE';
export const ON_PROFILE_RECOMMENDATIONS_REQUEST = 'ON_PROFILE_RECOMMENDATIONS_REQUEST';
export const ON_PROFILE_RECOMMENDATIONS_RESPONSE = 'ON_PROFILE_RECOMMENDATIONS_RESPONSE';
export const ON_USER_DETAILS_REQUEST = 'ON_USER_DETAILS_REQUEST';
export const ON_USER_DETAILS_RESPONSE = 'ON_USER_DETAILS_RESPONSE';

const profileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_ADD_PROFILE_TAG: {
      const selectedMoods = unique([...state.selectedMoods, action.mood.label]);
      const allSelectedTags = unique([...state.allSelectedTags, ...selectedMoods]);
      return Object.assign({}, state, {selectedMoods, allSelectedTags});
    }
    case ON_REMOVE_PROFILE_TAG: {
      const selectedMoods = state.selectedMoods.filter(mood => mood !== action.mood.label);
      const allSelectedTags = state.allSelectedTags.filter(tag => tag !== action.mood.label);
      return Object.assign({}, state, {selectedMoods, allSelectedTags});
    }
    case ON_ADD_PROFILE_AUTHOR: {
      const selectedAuthors = unique([...state.selectedAuthors, action.author.label]);
      const allSelectedTags = unique([...state.allSelectedTags, ...selectedAuthors]);
      return Object.assign({}, state, {selectedAuthors, allSelectedTags});
    }
    case ON_REMOVE_PROFILE_AUTHOR: {
      const selectedAuthors = state.selectedAuthors.filter(author => author !== action.author.label);
      const allSelectedTags = state.allSelectedTags.filter(tag => tag !== action.author.label);
      return Object.assign({}, state, {selectedAuthors, allSelectedTags});
    }
    case ON_ADD_PROFILE_ARCHETYPE: {
      const selectedArchetypes = [...state.selectedArchetypes, action.archetype.label];
      const selectedMoods = unique([...state.selectedMoods, ...action.archetype.moods]);
      const selectedAuthors = unique([...state.selectedAuthors, ...action.archetype.authors]);
      const allSelectedTags = unique([...state.allSelectedTags, ...selectedMoods, ...selectedAuthors]);
      return Object.assign({}, state, {selectedMoods, selectedAuthors, selectedArchetypes, allSelectedTags});
    }
    case ON_REMOVE_PROFILE_ARCHETYPE:
      return Object.assign({}, state, {selectedArchetypes: state.selectedArchetypes.filter(archetype => archetype !== action.archetype.label)});
    case ON_PROFILE_RECOMMENDATIONS_REQUEST:
      return Object.assign({}, state, {recommendations: Object.assign({}, state.recommendations, {isLoading: true})});
    case ON_PROFILE_RECOMMENDATIONS_RESPONSE:
      return Object.assign({}, state, {recommendations: {elements: action.recommendations, isLoading: false}});
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
