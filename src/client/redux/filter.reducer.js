import {getLeaves} from '../utils/filters';
import {getById} from '../utils/taxonomy';

const defaultState = {
  editFilters: false,
  beltFilters: {
    'En god bog': ['1001', '1003', '49', '1005'],
    'Bibliotekarens ugentlige anbefalinger': ['-2'],
    'Passer med min smag': [],
    'En spændende bog': ['55', '230', '267'],
    'En anderledes bog': ['143', '151'],
    'En let læst bog': ['234', '229'],
    'En bog der gør dig klogere': ['182', '184'],
    'En udfordrende bog': ['239', '236']
  },
  expandedFilters: [],
  filters: [
    {
      id: '0',
      title: 'Vælg stemning',
      items: getById('0').items
    },
    {
      title: 'Vælg længde',
      items: [
        {id: '1000', title: 'Kort', custom: true},
        {id: '1001', title: 'Medium længde', custom: true},
        {id: '1002', title: 'Laaaaaaaaaaaaaaaang', custom: true}
      ]
    },
    {
      title: 'Vælg kvalitetsparametre',
      items: [
        {id: '1003', title: 'Er på mange biblioteker', custom: true},
        {id: '-2', title: 'Bibliotekaren anbefaler'},
        {id: '1005', title: 'Udlånes meget', custom: true}
      ]
    },
    {
      title: 'Vælg tempo',
      items: getById('226').items
    },
    {
      title: 'Vælg sprogligt niveau',
      items: getById('232').items
    },
    {
      title: 'Vælg fortolkningsrum',
      items: getById('238').items
    },
    {
      title: 'Vælg fokus',
      items: [getById('267'), getById('266'), getById('265')]
    }
  ],
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
        beltFilters[action.beltName] = beltFilters[action.beltName].filter(
          id => filterId !== id
        );
      } else {
        beltFilters[action.beltName] = [
          ...beltFilters[action.beltName],
          filterId
        ];
      }
      return Object.assign({}, state, {beltFilters});
    }
    case ON_EXPAND_FILTERS_TOGGLE: {
      let expandedFilters;
      if (state.expandedFilters.indexOf(action.id) >= 0) {
        expandedFilters = state.expandedFilters.filter(id => id !== action.id);
      } else {
        expandedFilters = [...state.expandedFilters];
        expandedFilters.push(action.id);
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
