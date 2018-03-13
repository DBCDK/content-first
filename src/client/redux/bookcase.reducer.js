const defaultState = {
  celebs: [
    {
      id: '1',
      name: 'Helene Poulsen',
      img: 'img/bookcase/HP.jpg',
      description:
        'Helene Jeppesen er Danmarks mest fulgte booktuber. Hun læser bredt – både klassikere og helt ny skønlitteratur. Reolen bærer præg af hendes store interesse og kærlighed til det engelske sprog.',
      bookcase: 'img/bookcase/HP-bogreol.jpg',
      books: [
        {
          pid: '870970-basis:51704185',
          position: {x: 24.5, y: 12},
          description:
            'Romanen er skrevet af forfatteren til ”Stoner” og har mange af de samme kvaliteter. Her foregår handlingen blot i naturen, i det vilde vesten, hvor en gruppe mænd tager på Bisonjagt.'
        },
        {
          pid: '870970-basis:52921589',
          position: {x: 38.5, y: 12}
        },
        {
          pid: '870970-basis:51283376',
          position: {x: 58.5, y: 27}
        },
        {
          pid: '870970-basis:52911567',
          position: {x: 49.3, y: 61}
        },
        {
          pid: '870970-basis:53077145',
          position: {x: 28.3, y: 76}
        },
        {
          pid: '870970-basis:29554129',
          position: {x: 90, y: 61}
        }
      ]
    },
    {
      id: '2',
      name: 'B. S. Christiansen',
      img: 'img/bookcase/BS.jpg',
      description:
        'er en dansk forhenværende elitesoldat i Jægerkorpset og fordragsholder. Han er især kendt for programserien På afveje med forskellige kendte personer.',
      bookcase: 'img/bookcase/BS-bogreol.jpg',
      books: [
        {
          pid: '870970-basis:52530423',
          position: {x: 13.5, y: 40}
        },
        {
          pid: '870970-basis:53079202',
          position: {x: 21.8, y: 44}
        },
        {
          pid: '870970-basis:52038014',
          position: {x: 26, y: 46}
        },
        {
          pid: '870970-basis:23211629',
          position: {x: 36.5, y: 46}
        }
      ]
    },
    {
      id: '3',
      name: 'Dar Salim',
      img: 'img/bookcase/DS.jpg',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at rhoncus enim, ut facilisis velit. Donec eget augue vel lorem iaculis.',
      bookcase: 'img/bookcase/DS-bogreol.jpg',
      books: [
        {
          pid: '870970-basis:26378176',
          position: {x: 58, y: 37}
        },
        {
          pid: '870970-basis:53052932',
          position: {x: 58, y: 46}
        },
        {
          pid: '870970-basis:52728843',
          position: {x: 64, y: 55}
        },
        {
          pid: '870970-basis:29158347',
          position: {x: 64, y: 68}
        },
        {
          pid: '870970-basis:27617050',
          position: {x: 60, y: 83}
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
