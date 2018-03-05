const defaultState = {
  celebs: [
    {
      id: '1',
      name: 'Bjarne Slot Christiansen',
      img: 'img/bookcase/BS3.png',
      description:
        'er en dansk forhenværende elitesoldat i Jægerkorpset og fordragsholder. Han er især kendt for programserien På afveje med forskellige kendte personer, og har også deltaget i flere selvhjælpsserier. Skrev i 2005 bogen Et liv på kanten',
      bookcase: 'img/bookcase/BS-bogreol.png',
      books: [
        {
          pid: '870970-basis:52530423',
          position: {x: 13.5, y: 40},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:53079202',
          position: {x: 21.8, y: 44},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:52038014',
          position: {x: 26, y: 46},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:23211629',
          position: {x: 36.5, y: 46},
          description: 'lorem ipsum . . .'
        }
      ]
    },
    {
      id: '2',
      name: 'Helene Poulsen',
      img: 'img/bookcase/HP.png',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at rhoncus enim, ut facilisis velit. Donec eget augue vel lorem iaculis pulvinar a vitae nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. . . .',
      bookcase: 'img/bookcase/HP-bogreol.png',
      books: [
        {
          pid: '870970-basis:53089100',
          position: {x: 28, y: 14},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:52921589',
          position: {x: 38, y: 32},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:51283376',
          position: {x: 59.5, y: 32},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:52911567',
          position: {x: 84, y: 74},
          description: 'lorem ipsum . . .'
        }
      ]
    }
  ]
};

export const ON_BOOK_REQUEST_TEST = 'ON_BOOK_REQUEST_TEST';

const bookcaseReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_BOOK_REQUEST_TEST: {
      return Object.assign({}, {state});
    }

    default:
      return state;
  }
};

export default bookcaseReducer;
