const defaultState = {
  belts: [
    {
      name: 'Bibliotekarens ugentlige anbefalinger',
      isLoading: false,
      scrollOffset: 0,
      works: [
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg',
          metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'Another book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'}
      ]
    },
    {
      name: 'En god bog',
      isLoading: true,
      tags: [
        {name: 'Aktuelt', selected: false},
        {name: 'Klassikere', selected: false},
        {name: 'Let læst', selected: false}
      ],
      scrollOffset: 0,
      works: [
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg',
          metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
        {title: 'Another book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'}
      ]
    },
    {
      name: 'Passer med min smag',
      isLoading: false
    },
    {
      name: 'Gør mig glad',
      isLoading: true,
      tags: [
        {name: 'Dansk', selected: false},
        {name: 'Hygge', selected: false},
        {name: 'Slap af i hængekøjen', selected: false},
        {name: 'Kur mod kærestesorger', selected: false}
      ],
      works: []
    }
  ]
};

export const ON_BELT_REQUEST = 'ON_BELT_LOAD';
export const ON_BELT_RESPONSE = 'ON_BELT_RESPONSE';
export const ON_BELT_SCROLL = 'ON_BELT_SCROLL';
export const ON_TAG_TOGGLE = 'ON_TAG_TOGGLE';

const beltsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_BELT_REQUEST:
      return state;

    case ON_BELT_RESPONSE:
      return state;

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
