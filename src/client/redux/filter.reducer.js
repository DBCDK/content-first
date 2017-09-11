import {getLeaves} from '../utils/filters';

const defaultState = {
  editFilters: false,
  beltFilters: {
    'En god bog': [0, 5],
    'Bibliotekarens ugentlige anbefalinger': [],
    'Passer med min smag': [],
    'Gør mig glad': [3, 6]
  },
  filters: [
    {
      title: 'Vælg stemning',
      children: [
        {
          title: 'Optimistisk',
          children: [
            {title: 'Glade dage'},
            {title: 'Mega glade dage'}
          ]
        },
        {
          title: 'Charmerende',
          children: [
            {title: 'Elegant'},
            {title: 'Sympatisk'},
            {title: 'Øm'}
          ]
        }
      ]
    },
    {
      title: 'Vælg længde',
      children: [
        {title: 'Kort bog'},
        {title: 'Medium længde'},
        {title: 'Lang bog'}
      ]
    },
    {
      title: 'Vælg kvalitetsparametre',
      children: [
        {title: 'Gode anmeldelser'},
        {title: 'Gode ratings'},
        {title: 'Lang bog'}
      ]
    }
  ],
  isLoading: false,
  works: [
    {title: 'A book', cover: '/870970-basis-53188931.391x500.jpg',
      metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
    {title: 'A book', cover: '/frontpage.jpg', metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
    {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
    {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
    {title: 'A book', cover: '/frontpage.jpg'},
    {title: 'A book', cover: '870970-basis-53188931.391x500.jpg'},
    {title: 'A book', cover: '/870970-basis-53188931.391x500.jpg',
      metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
    {title: 'A book', cover: '/frontpage.jpg'},
    {title: 'A book', cover: '/frontpage.jpg'},
    {title: 'A book', cover: '/frontpage.jpg'}
  ],
  sortBy: [
    {title: 'Min smag', selected: true},
    {title: 'Linse Kesslers smag', selected: false},
    {title: 'Martin Krasniks smag', selected: false},
    {title: 'Bonderøvens smag', selected: false}
  ]
};

export const ON_FILTER_REQUEST = 'ON_FILTER_REQUEST';
export const ON_FILTER_RESPONSE = 'ON_FILTER_RESPONSE';
export const ON_SORT_OPTION_SELECT = 'ON_SORT_OPTION_SELECT';
export const ON_EDIT_FILTER_TOGGLE = 'ON_EDIT_FILTER_TOGGLE';
export const ON_FILTER_TOGGLE = 'ON_FILTER_TOGGLE';
export const ON_RESET_FILTERS = 'ON_RESET_FILTERS';

const filterReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_FILTER_REQUEST:
      return state;
    case ON_FILTER_RESPONSE:
      return state;
    case ON_SORT_OPTION_SELECT: {
      const sortBy = state.sortBy.map(option => {
        return {title: option.title, selected: option.title === action.value};
      });
      return Object.assign({}, state, {sortBy});
    }
    case ON_EDIT_FILTER_TOGGLE:
      return Object.assign({}, state, {editFilters: !state.editFilters});
    case ON_FILTER_TOGGLE: {
      let filterId;
      getLeaves(state.filters).forEach((filter, id) => {
        if (filter === action.filter) {
          filterId = id;
        }
      });
      const beltFilters = Object.assign({}, state.beltFilters);
      if (beltFilters[action.beltName].includes(filterId)) {
        beltFilters[action.beltName] = beltFilters[action.beltName].filter(id => filterId !== id);
      }
      else {
        beltFilters[action.beltName] = [...beltFilters[action.beltName], filterId];
      }
      return Object.assign({}, state, {beltFilters});
    }
    case ON_RESET_FILTERS: {
      const beltFilters = Object.assign({}, state.beltFilters);
      beltFilters[action.beltName] = defaultState.beltFilters[action.beltName];
      return Object.assign({}, state, {beltFilters});
    }
    default:
      return state;
  }
};

export default filterReducer;
