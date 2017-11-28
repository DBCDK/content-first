import {
  addElementsToProfiles,
  removeElementFromProfiles
} from '../utils/profile';

const defaultProfile = {
  moods: [],
  authors: [],
  genres: [],
  archetypes: [],
  allSelectedTags: []
};

const defaultState = {
  user: {
    isLoading: false,
    isLoggedIn: false
  },
  profileTastes: {
    currentTaste: null,
    profiles: {}
  },
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
    genres: [
      {
        label: 'Biografiske romaner',
        image: '/genres/small/biografiske-romaner.jpg'
      },
      {
        label: 'Biografiske skuespil',
        image: '/genres/small/biografiske-skuespil.jpg'
      },
      {label: 'Brevromaner', image: '/genres/small/brevromaner.jpg'},
      {
        label: 'Eventyr, sagn og myter',
        image: '/genres/small/eventyr-sagn-og-myter.jpg'
      },
      {
        label: 'Eventyrlige fortællinger',
        image: '/genres/small/eventyrlige-fortaellinger.jpg'
      },
      {
        label: 'Fantasy, fremtid og science fiction',
        image: '/genres/small/fantasy-fremtid-og-science-fiction.jpg'
      },
      {label: 'Humor og satire', image: '/genres/small/humor-og-satire.jpg'},
      {
        label: 'I Danmark',
        image: '/genres/small/i-danmark---i-andre-lande.jpg'
      },
      {
        label: 'Krimi, gys og spænding',
        image: '/genres/small/krimi-gys-og-spaending.jpg'
      },
      {
        label: 'Let at læse',
        image: '/genres/small/let-at-laese---for-voksne.jpg'
      },
      {label: 'Noveller', image: '/genres/small/noveller.jpg'},
      {label: 'Poesi', image: '/genres/small/poesi.jpg'},
      {label: 'Robinsonader', image: '/genres/small/robinsonader.jpg'},
      {
        label: 'Samfund, arbejde og dagligliv',
        image: '/genres/small/samfund-arbejde-og-dagligliv.jpg'
      },
      {label: 'Tegneserier', image: '/genres/small/tegneserier.jpg'},
      {
        label: 'Tilbage i historien',
        image: '/genres/small/tilbage-i-historien.jpg'
      },
      {label: 'Westerns', image: '/genres/small/westerns.jpg'}
    ],
    archetypes: [
      {
        label: 'romantikeren',
        image: '/archetypes/romantikeren.jpg',
        moods: ['fantasifuld', 'erotisk'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        authors: ['Carsten Jensen', 'Hanne Vibeke Holst']
      },
      {
        label: 'hestepigen',
        image: '/archetypes/hestepigen.jpg',
        moods: ['fantasifuld', 'dramatisk'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        authors: ['Anne Lise Marstrand Jørgensen']
      },
      {
        label: 'kynikeren',
        image: '/archetypes/kynikeren.jpg',
        moods: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        authors: ['Kim Leine', 'Paula Hawkins']
      }
    ],
    authors: [
      {
        label: 'Anne Lise Marstrand Jørgensen',
        image: '/authors/anne-lise-marstrand-joergensen.jpg',
        genres: ['fantasifuld', 'erotisk'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        byline: 'about the author'
      },
      {
        label: 'Carsten Jensen',
        image: '/authors/carsten-jensen.jpg',
        genres: ['fantasifuld', 'dramatisk'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        byline: 'about the author'
      },
      {
        label: 'Hanne Vibeke Holst',
        image: '/authors/hanne-vibeke-holst.jpg',
        genres: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        byline: 'about the author'
      },
      {
        label: 'Kim Leine',
        image: '/authors/kim-leine.jpg',
        genres: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        byline: 'about the author'
      },
      {
        label: 'Paula Hawkins',
        image: '/authors/paula-hawkins.jpg',
        genres: ['intellektuel', 'frygtelig', 'kompleks'],
        likes: [
          '870970-basis:52038014',
          '870970-basis:52530423',
          '870970-basis:52939321'
        ],
        byline: 'about the author'
      }
    ]
  }
};

export const ON_ADD_PROFILE_ELEMENT = 'ON_ADD_PROFILE_ELEMENT';
export const ON_REMOVE_PROFILE_ELEMENT = 'ON_REMOVE_PROFILE_ELEMENT';
export const ON_ADD_PROFILE_ARCHETYPE = 'ON_ADD_PROFILE_ARCHETYPE';
export const ON_PROFILE_RECOMMENDATIONS_REQUEST =
  'ON_PROFILE_RECOMMENDATIONS_REQUEST';
export const ON_PROFILE_RECOMMENDATIONS_RESPONSE =
  'ON_PROFILE_RECOMMENDATIONS_RESPONSE';
export const ON_USER_DETAILS_REQUEST = 'ON_USER_DETAILS_REQUEST';
export const ON_USER_DETAILS_RESPONSE = 'ON_USER_DETAILS_RESPONSE';
export const ON_LOGOUT_REQUEST = 'ON_LOGOUT_REQUEST';
export const ON_LOGOUT_RESPONSE = 'ON_LOGOUT_RESPONSE';
export const ON_PROFILE_CREATE_TASTE = 'ON_PROFILE_CREATE_TASTE';
export const ON_PROFILE_SELECT_TASTE = 'ON_PROFILE_SELECT_TASTE';
export const ON_PROFILE_LOAD_PROFILES = 'ON_PROFILE_LOAD_PROFILES';
export const ON_PROFILE_LOAD_PROFILES_RESPONSE =
  'ON_PROFILE_LOAD_PROFILES_RESPONSE';
export const ON_PROFILE_REMOVE_CURRENT_PROFILE =
  'ON_PROFILE_REMOVE_CURRENT_PROFILE';

const profileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_ADD_PROFILE_ELEMENT: {
      return Object.assign(
        {},
        state,
        addElementsToProfiles(state.profileTastes, {
          [action.elementType]: [action.element.label]
        })
      );
    }
    case ON_REMOVE_PROFILE_ELEMENT: {
      return Object.assign(
        {},
        state,
        removeElementFromProfiles(
          state.profileTastes,
          action.elementType,
          action.element.label
        )
      );
    }
    case ON_ADD_PROFILE_ARCHETYPE: {
      const updateElements = {
        archetypes: [action.element.label],
        moods: action.element.moods,
        authors: action.element.authors
      };
      return Object.assign(
        {},
        state,
        addElementsToProfiles(state.profileTastes, updateElements)
      );
    }
    case ON_PROFILE_RECOMMENDATIONS_REQUEST:
      return Object.assign({}, state, {
        recommendations: Object.assign({}, state.recommendations, {
          isLoading: true
        })
      });
    case ON_PROFILE_RECOMMENDATIONS_RESPONSE:
      return Object.assign({}, state, {
        recommendations: {elements: action.recommendations, isLoading: false}
      });
    case ON_USER_DETAILS_REQUEST:
      return Object.assign({}, state, {
        user: Object.assign({}, state.user, {isLoading: true})
      });
    case ON_USER_DETAILS_RESPONSE:
      if (!action.user) {
        return Object.assign({}, state, {user: defaultState.user});
      }
      return Object.assign({}, state, {
        user: Object.assign({}, action.user, {
          isLoggedIn: true,
          isLoading: false
        })
      });
    case ON_LOGOUT_REQUEST:
      return Object.assign({}, state, {
        user: Object.assign({}, state.user, {isLoading: true})
      });
    case ON_LOGOUT_RESPONSE:
      return Object.assign({}, state, {
        user: Object.assign({}, state.user, {
          isLoggedIn: false,
          isLoading: false
        })
      });
    case ON_PROFILE_CREATE_TASTE: {
      const currentTaste = action.name;
      const profiles = Object.assign({}, state.profiletastes.profiles, {
        [currentTaste]: Object.assign({}, defaultProfile)
      });
      return Object.assign({}, state, {
        profileTastes: {profiles, currentTaste}
      });
    }
    case ON_PROFILE_SELECT_TASTE: {
      const currentTaste = action.name;
      return Object.assign({}, state, {
        profileTastes: Object.assign({}, state.profileTastes, {currentTaste})
      });
    }
    case ON_PROFILE_LOAD_PROFILES_RESPONSE: {
      return Object.assign({}, state, {
        profileTastes: Object.assign(
          {},
          action.profileTastes || state.profileTastes,
          {loading: false}
        )
      });
    }
    case ON_PROFILE_LOAD_PROFILES: {
      return Object.assign({}, state, {
        profileTastes: Object.assign({}, state.profileTastes, {loading: true})
      });
    }
    case ON_PROFILE_REMOVE_CURRENT_PROFILE: {
      return Object.assign({}, state, {
        profileTastes: Object.assign({}, state.profileTastes, {
          currentTaste: null
        })
      });
    }
    default:
      return state;
  }
};

export default profileReducer;
