/* eslint-disable */
const defaultState = {
  Stemning: {
    title: 'Stemning',
    image: 'img/filters/mood.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true,
    border: {color: 'var(--pistache)', active: true}
  },
  Tempo: {
    title: 'Tempo',
    image: 'img/filters/speed.jpg',
    template: 'CardRange',
    icon: 'signal_cellular_4_bar',
    range: [5629, 5630, 5631, 5632, 5633],
    closeOnSelect: false,
    expanded: false,
    show: true,
    border: {color: 'var(--korn)', active: true}
  },
  Længde: {
    title: 'Længde',
    image: 'img/filters/length.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true,
    border: {color: 'var(--elm)', active: true}
  },
  Univers: {
    title: 'Univers',
    image: 'img/filters/universe.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expandeds: false,
    show: true,
    border: {color: 'var(--silver-chalice)', active: true}
  },
  Fortællerstemme: {
    title: 'Fortællerstemme',
    image: 'img/filters/voice.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expandeds: false,
    show: true,
    border: {color: 'var(--kobber)', active: true}
  },
  Sprog: {
    title: 'Sprog',
    image: 'img/filters/language.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true,
    border: {color: 'var(--due)', active: true}
  },
  Skrivestil: {
    title: 'Skrivestil',
    image: 'img/filters/style.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: true,
    border: {color: 'var(--fersken)', active: true}
  },
  'Handlingens tid': {
    title: 'Handlingens tid',
    image: 'img/filters/time.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expandeds: false,
    show: true,
    border: {color: 'var(--petroleum)', active: true}
  },
  'På biblioteket': {
    title: 'På biblioteket',
    image: 'img/filters/length.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: false,
    expanded: false,
    show: false,
    border: {color: '#ff0000', active: true}
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
