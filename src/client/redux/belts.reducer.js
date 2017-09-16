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
      pids: ['870970-basis:52947804', '870970-basis:52930006', '870970-basis:53309844',
        '870970-basis:52995078', '870970-basis:29677824', '870970-basis:25696905',
        '870970-basis:53356923', '870970-basis:53307469', '870970-basis:26496128',
        '870970-basis:25792300', '870970-basis:52626919', '870970-basis:22188836',
        '870970-basis:26189985', '870970-basis:51998383', '870970-basis:25758862',
        '870970-basis:25418611', '870970-basis:25448936', '870970-basis:52038014',
        '870970-basis:52752361', '870970-basis:52530423', '870970-basis:52203201',
        '870970-basis:52182239', '870970-basis:52398517', '870970-basis:29346615',
        '870970-basis:51901894', '870970-basis:28011059', '870970-basis:29662177',
        '870970-basis:51397207', '870970-basis:51321944', '870970-basis:52354048',
        '820030-katalog:1176658', '870970-basis:21446246', '870970-basis:51004590'],
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
