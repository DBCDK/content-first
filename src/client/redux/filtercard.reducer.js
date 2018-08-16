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
  Længde: {
    title: 'Længde',
    image: 'img/filters/length.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: true,
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
  'Handlingens tid': {
    title: 'Handlingens tid',
    image: 'img/filters/universe.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: true,
    expandeds: false,
    show: true
  },
  'På biblioteket': {
    title: 'På biblioteket',
    image: 'img/filters/length.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: true,
    expanded: false,
    show: false
  },
  Struktur: {
    title: 'Struktur',
    image: 'img/filters/structure.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: true,
    expanded: false,
    show: true
  },
  Skrivestil: {
    title: 'Skrivestil',
    image: 'img/filters/style.jpg',
    template: 'CardList',
    icon: false,
    closeOnSelect: true,
    expanded: false,
    show: true
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
