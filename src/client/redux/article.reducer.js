/* eslint import/no-webpack-loader-syntax: off */
import About from '!raw-loader!../components/article/pages/about.md';
import NotFound from '!raw-loader!../components/article/pages/404.md';

const defaultState = {
  articles: {
    '/om': {
      id: 1,
      name: 'om',
      title: 'Om Læsekompasset',
      src: About
    },
    '/404': {
      id: 2,
      name: '404',
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
