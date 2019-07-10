/* eslint import/no-webpack-loader-syntax: off */
import About from '!raw-loader!../components/article/pages/about.md';
import NotFound from '!raw-loader!../components/article/pages/404.md';

const defaultState = {
  articles: {
    '/om': {
      id: 1,
      name: 'om',
      title: 'Om Læsekompasset',
      meta: {
        title: 'Om',
        /* eslint-disable max-len */
        description:
          'Læsekompasset er bibliotekernes online inspirationsværktøj til dig. Brug det til at finde ny læsning ud fra den læseoplevelse du er i humør til og lån bøgerne på biblioteket.',
        /* eslint-ensable max-len */
        canonical: '/om',
        og: {
          title: 'Om lasekompas.dk',
          description: 'Hvad er laesekompas.dk?',
          url: 'https://laesekompas.dk/om',
          type: 'website'
        }
      },
      src: About
    },
    '/404': {
      id: 2,
      name: '404',
      meta: {
        title: '404 - Siden blev ikke fundet',
        canonical: '/404',
        robots: 'noindex'
      },
      src: NotFound
    }
  },
  isLoading: false
};

const articleReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default articleReducer;
