const defaultState = {
  belts: [
    {
      name: 'Bibliotekarens ugentlige anbefalinger',
      details: 'Detaljer for ugentlige anbefalinger',
      isLoading: false,
      scrollOffset: 0,
      works: [
        {title: 'A book', cover: '/870970-basis-53188931.391x500.jpg',
          metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: '/frontpage.jpg', metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
        {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'}
      ]
    },
    {
      name: 'En god bog',
      details: 'Detaljer for en god bog',
      isLoading: true,
      scrollOffset: 0,
      works: [
        {title: 'A book', cover: '/870970-basis-53188931.391x500.jpg',
          metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: '/frontpage.jpg', metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
        {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'}
      ]
    },
    {
      name: 'Passer med min smag',
      details: 'Detaljer for min smag',
      isLoading: false
    },
    {
      name: 'Gør mig glad',
      details: 'Detaljer for gør mig glad',
      isLoading: true,
      scrollOffset: 0,
      works: [
        {title: 'A book', cover: '/870970-basis-53188931.391x500.jpg',
          metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: '/frontpage.jpg', metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
        {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
        {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'},
        {title: 'A book', cover: '/frontpage.jpg'}
      ]
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
