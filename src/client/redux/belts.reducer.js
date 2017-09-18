const defaultState = {
  belts: [
    {
      name: 'En god bog',
      details: 'Detaljer for en god bog',
      isLoading: false,
      onFrontPage: true,
      links: ['Spændende', 'Anderledes'],
      scrollOffset: 0,
      works: []
    },
    {
      name: 'Let læst',
      isLoading: false,
      onFrontPage: true,
      links: ['Klog', 'Udfordrende'],
      scrollOffset: 0
    },
    {
      name: 'Bibliotekarens ugentlige anbefalinger',
      details: 'Detaljer for ugentlige anbefalinger',
      isLoading: false,
      onFrontPage: true,
      links: [],
      scrollOffset: 0,
      works: []
    },
    {
      name: 'Passer med min smag',
      details: 'Detaljer for min smag',
      isLoading: false,
      onFrontPage: true,
      links: []
    },
    {
      name: 'Spændende',
      isLoading: false,
      onFrontPage: false,
      links: []
    },
    {
      name: 'Anderledes',
      isLoading: false,
      onFrontPage: false,
      links: []
    },
    {
      name: 'Klog',
      isLoading: false,
      onFrontPage: false,
      links: []
    },
    {
      name: 'Udfordrende',
      isLoading: false,
      onFrontPage: false,
      links: []
    }
  ]
};

export const ON_BELT_REQUEST = 'ON_BELT_REQUEST';
export const ON_BELT_RESPONSE = 'ON_BELT_RESPONSE';
export const ON_BELT_SCROLL = 'ON_BELT_SCROLL';
export const ON_TAG_TOGGLE = 'ON_TAG_TOGGLE';

const beltsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_BELT_REQUEST: {
      const belts = state.belts.map(belt => {
        if (belt.name === action.beltName) {
          return Object.assign({}, belt, {isLoading: true});
        }
        return belt;
      });
      return Object.assign({}, {belts});
    }

    case ON_BELT_RESPONSE: {
      const belts = state.belts.map(belt => {
        if (belt.name === action.beltName) {
          return Object.assign({}, belt, {isLoading: false}, {works: action.response});
        }
        return belt;
      });
      return Object.assign({}, {belts});
    }

    case ON_BELT_SCROLL: {
      const belts = [...state.belts];
      const belt = belts[action.id];
      if (action.scrollOffset < 0) {
        action.scrollOffset = 0;
      }
      else if (action.scrollOffset > belt.works.length - 1) {
        action.scrollOffset = belt.works.length - 1;
      }
      belts[action.id] = Object.assign({}, belt, {scrollOffset: action.scrollOffset});
      return Object.assign({}, {belts});
    }

    case ON_TAG_TOGGLE: {
      const belts = [...state.belts];
      const belt = Object.assign({}, belts[action.beltId]);
      belts[action.beltId] = belt;
      belt.tags = [...belt.tags];
      belt.tags[action.tagId] = {
        name: belt.tags[action.tagId].name,
        selected: belt.tags[action.tagId].selected === false
      };
      return Object.assign({}, {belts});
    }

    default:
      return state;
  }
};

export default beltsReducer;
