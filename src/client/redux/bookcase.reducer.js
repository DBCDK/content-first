const defaultState = {
  celebs: [
    {
      id: '1',
      name: 'Helene Poulsen',
      img: 'img/bookcase/HP.png',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at rhoncus enim, ut facilisis velit. Donec eget augue vel lorem iaculis.',
      bookcase: 'img/bookcase/HP-bogreol3.png',
      books: [
        {
          pid: '870970-basis:53089100',
          position: {x: 24.5, y: 12},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:52921589',
          position: {x: 38.5, y: 12},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:51283376',
          position: {x: 58.5, y: 27},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:52911567',
          position: {x: 49.3, y: 61},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:53077145',
          position: {x: 28.3, y: 76},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:29554129',
          position: {x: 90, y: 61},
          description: 'lorem ipsum . . .'
        }
      ]
    },
    {
      id: '2',
      name: 'B. S. Christiansen',
      img: 'img/bookcase/BS3.png',
      description:
        'er en dansk forhenværende elitesoldat i Jægerkorpset og fordragsholder. Han er især kendt for programserien På afveje med forskellige kendte personer.',
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
      id: '3',
      name: 'Dar Salim',
      img: 'img/bookcase/DS2.png',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at rhoncus enim, ut facilisis velit. Donec eget augue vel lorem iaculis.',
      bookcase: 'img/bookcase/DS-bogreol.png',
      books: [
        {
          pid: '870970-basis:26378176',
          position: {x: 58, y: 37},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:53052932',
          position: {x: 58, y: 46},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:52728843',
          position: {x: 64, y: 55},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:29158347',
          position: {x: 64, y: 68},
          description: 'lorem ipsum . . .'
        },
        {
          pid: '870970-basis:27617050',
          position: {x: 60, y: 83},
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
