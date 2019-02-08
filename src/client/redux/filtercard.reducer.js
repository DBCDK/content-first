import T from '../components/base/T';

/* eslint-disable */

const defaultState = {
  Stemning: {
    title: 'Stemning',
    image: 'img/filters/mood.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true
  },
  Tempo: {
    title: 'Tempo',
    image: 'img/filters/speed.jpg',
    template: 'CardRange',
    icon: 'signal_cellular_4_bar',
    range: [5629, 5630, 5631, 5632, 5633],
    closeOnSelect: false,
    expanded: false,
    show: true
  },
  Længde: {
    title: 'Længde',
    image: 'img/filters/length.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true
  },
  Univers: {
    title: 'Univers',
    image: 'img/filters/universe.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expandeds: false,
    show: true
  },
  Fortællerstemme: {
    title: 'Fortællerstemme',
    image: 'img/filters/voice.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expandeds: false,
    show: true
  },
  Sprog: {
    title: 'Sprog',
    image: 'img/filters/language.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true
  },
  Skrivestil: {
    title: 'Skrivestil',
    image: 'img/filters/style.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true
  },
  'Handlingens tid': {
    title: 'Handlingens tid',
    image: 'img/filters/time.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expandeds: false,
    show: true
  },
  'På biblioteket': {
    title: 'På biblioteket',
    image: 'img/filters/length.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: false
  }
};

/* eslint-enable */

const filtercardReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default filtercardReducer;
