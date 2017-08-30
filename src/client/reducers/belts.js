const defaultState = {
  belts: [
    {
      name: 'Bibliotekarens ugentlige anbefalinger',
      isLoading: false,
      works: [
        {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg', metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
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
        'Aktuelt',
        'Klassikere',
        'Let læst'
      ],
      works: []
    },
    {
      name: 'Gør mig klogere',
      isLoading: true,
      tags: [
        'Sejt at have læst',
        'Andeleredes',
        'Undervurderet'
      ],
      works: []
    },
    {
      name: 'Passer med min smag',
      isLoading: true,
      works: []
    },
    {
      name: 'Gør mig glad',
      isLoading: true,
      tags: [
        'Dansk',
        'Hygge',
        'Slap af i hængekøjen',
        'Kur mod kærestesorger'
      ],
      works: []
    }
  ]
};

export const ON_BELT_REQUEST = 'ON_BELT_LOAD';
export const ON_BELT_RESPONSE = 'ON_BELT_RESPONSE';

const beltsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_BELT_REQUEST:
      return state;
    case ON_BELT_RESPONSE:
      return state;
    default:
      return state;
  }
};

export default beltsReducer;
