import {taxonomy, getLeaves} from '../utils/taxonomy';

const defaultState = {
  editFilters: false,
  beltFilters: {
    'En god bog': [100001, 100003, 5672, 100005],
    'Bibliotekarens ugentlige anbefalinger': [-2],
    'En spændende bog': [5676, 5632],
    'En anderledes bog': [5702]
  },
  expandedFilters: {},
  filters: {
    'Vælg stemning': taxonomy.stemning,
    'Vælg længde': [{id: 100000, title: 'Kort', custom: true}, {id: 100001, title: 'Medium længde', custom: true}, {id: 100002, title: 'Laaaaaaaaaaaaaaaang', custom: true}],
    'Vælg kvalitetsparametre': [
      {id: 100003, title: 'Er på mange biblioteker', custom: true},
      {id: -2, title: 'Bibliotekaren anbefaler'},
      {id: 100005, title: 'Udlånes meget', custom: true}
    ],
    'Vælg tempo': taxonomy.fortælleteknik.tempo
  },
  sortBy: [
    {id: 'default', title: 'Alfabetisk', selected: true},
    {id: 'linse', title: 'Linse Kesslers smag', selected: false},
    {id: 'krasnik', title: 'Martin Krasniks smag', selected: false},
    {id: 'cecilie', title: 'Cecilie Frøkjærs smag', selected: false},
    {id: 'anders', title: 'Anders Brødsgaards smag', selected: false},
    {id: 'jacob', title: 'Jacob Jaskovs smag', selected: false}
  ]
};

export const ON_SORT_OPTION_SELECT = 'ON_SORT_OPTION_SELECT';
export const ON_EDIT_FILTER_TOGGLE = 'ON_EDIT_FILTER_TOGGLE';
export const ON_FILTER_TOGGLE = 'ON_FILTER_TOGGLE';
export const ON_EXPAND_FILTERS_TOGGLE = 'ON_EXPAND_FILTERS_TOGGLE';
export const ON_RESET_FILTERS = 'ON_RESET_FILTERS';

const filterReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_SORT_OPTION_SELECT: {
      const sortBy = state.sortBy.map(option => {
        return Object.assign({}, option, {
          selected: option.title === action.value
        });
      });
      return Object.assign({}, state, {sortBy});
    }
    case ON_EDIT_FILTER_TOGGLE:
      return Object.assign({}, state, {editFilters: !state.editFilters});
    case ON_FILTER_TOGGLE: {
      let filterId;
      getLeaves(state.filters).forEach(filter => {
        if (filter.id === action.filterId) {
          filterId = filter.id;
        }
      });
      if (!filterId) {
        return state;
      }
      const beltFilters = Object.assign({}, state.beltFilters);
      if (beltFilters[action.beltName].indexOf(filterId) >= 0) {
        beltFilters[action.beltName] = beltFilters[action.beltName].filter(id => filterId !== id);
      } else {
        beltFilters[action.beltName] = [...beltFilters[action.beltName], filterId];
      }
      return Object.assign({}, state, {beltFilters});
    }
    case ON_EXPAND_FILTERS_TOGGLE: {
      const expandedFilters = Object.assign({}, state.expandedFilters);
      if (expandedFilters[action.id]) {
        delete expandedFilters[action.id];
      } else {
        expandedFilters[action.id] = true;
      }
      return Object.assign({}, state, {expandedFilters});
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
