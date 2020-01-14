/* eslint import/no-webpack-loader-syntax: off */
import About from '!raw-loader!../components/article/pages/about.md';
import Policy from '!raw-loader!../components/article/pages/Policy.md';

import NotFound from '!raw-loader!../components/article/pages/404.md';
import LoginError from '!raw-loader!../components/article/pages/loginError.md';

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
          url: 'https://laesekompas.dk/om',
          type: 'website'
        }
      },
      src: About
    },
    '/vilkaar-og-betingelser': {
      id: 1,
      name: 'vilkaar-og-betingelser',
      title: 'Vilkår og betingelser',
      meta: {
        title: 'Vilkår og betingelser',
        canonical: '/vilkaar-og-betingelser',
        og: {
          url: 'https://laesekompas.dk/vilkaar-og-betingelser',
          type: 'website'
        }
      },
      src: Policy
    },
    '/loginfejl': {
      id: 2,
      name: 'loginfejl',
      meta: {
        title: 'Kompasset blev forvirret',
        canonical: '/loginfejl',
        robots: 'noindex'
      },
      src: LoginError
    },
    '/404': {
      id: 3,
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
