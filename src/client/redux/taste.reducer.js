import {addElementsToTastes, removeElementFromTastes} from '../utils/tastes';

const defaultProfile = {
  moods: [],
  authors: [],
  genres: [],
  archetypes: [],
  allSelectedTags: []
};

const defaultState = {
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

export const ADD_TASTE_ELEMENT = 'ADD_TASTE_ELEMENT';
export const REMOVE_TASTE_ELEMENT = 'REMOVE_TASTE_ELEMENT';
export const ADD_TASTE_ARCHETYPE = 'ADD_TASTE_ARCHETYPE';
export const TASTE_RECOMMENDATIONS_REQUEST = 'TASTE_RECOMMENDATIONS_REQUEST';
export const TASTE_RECOMMENDATIONS_RESPONSE = 'TASTE_RECOMMENDATIONS_RESPONSE';
export const CREATE_TASTE = 'CREATE_TASTE';
export const TASTE_SELECT_TASTE = 'TASTE_SELECT_TASTE';
export const LOAD_TASTES = 'LOAD_TASTES';
export const LOAD_TASTES_RESPONSE = 'LOAD_TASTES_RESPONSE';
export const REMOVE_CURRENT_TASTE = 'REMOVE_CURRENT_TASTE';

const tasteReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TASTE_ELEMENT: {
      return Object.assign(
        {},
        state,
        addElementsToTastes(state.profileTastes, {
          [action.elementType]: [action.element.label]
        })
      );
    }
    case REMOVE_TASTE_ELEMENT: {
      return Object.assign(
        {},
        state,
        removeElementFromTastes(
          state.profileTastes,
          action.elementType,
          action.element.label
        )
      );
    }
    case ADD_TASTE_ARCHETYPE: {
      const updateElements = {
        archetypes: [action.element.label],
        moods: action.element.moods,
        authors: action.element.authors
      };
      return Object.assign(
        {},
        state,
        addElementsToTastes(state.profileTastes, updateElements)
      );
    }
    case TASTE_RECOMMENDATIONS_REQUEST:
      return Object.assign({}, state, {
        recommendations: Object.assign({}, state.recommendations, {
          isLoading: true
        })
      });
    case TASTE_RECOMMENDATIONS_RESPONSE:
      return Object.assign({}, state, {
        recommendations: {elements: action.recommendations, isLoading: false}
      });
    case CREATE_TASTE: {
      const currentTaste = action.name;
      const profiles = Object.assign({}, state.profileTastes.profiles, {
        [currentTaste]: Object.assign({}, defaultProfile)
      });
      return Object.assign({}, state, {
        profileTastes: {profiles, currentTaste}
      });
    }
    case TASTE_SELECT_TASTE: {
      const currentTaste = action.name;
      return Object.assign({}, state, {
        profileTastes: Object.assign({}, state.profileTastes, {currentTaste})
      });
    }
    case LOAD_TASTES_RESPONSE: {
      return Object.assign({}, state, {
        profileTastes: Object.assign(
          {},
          action.profileTastes || state.profileTastes,
          {loading: false}
        )
      });
    }
    case LOAD_TASTES: {
      return Object.assign({}, state, {
        profileTastes: Object.assign({}, state.profileTastes, {loading: true})
      });
    }
    case REMOVE_CURRENT_TASTE: {
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

export default tasteReducer;
