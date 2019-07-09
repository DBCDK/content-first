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
        canonical: '/om',
        og: {
          title: 'Om lasekompas.dk',
          description: 'Hvad er laesekompas.dk?',
          url: 'https://laesekompas.dk/om',
          type: 'website',
          image: {
            url: 'http://laesekompas.dk/img/open-graph/hero-01.jpg',
            width: '1200',
            height: '675'
          }
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
