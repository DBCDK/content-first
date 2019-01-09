import {taxonomy, getLeaves, getLeavesMap} from '../utils/taxonomy';
const leavesMap = getLeavesMap();

export const filters = {
  Stemning: taxonomy.stemning,
  Længde: [
    {id: 100000, title: 'Kort', custom: true},
    {id: 100001, title: 'Medium længde', custom: true},
    {id: 100002, title: 'Lang', custom: true}
  ],
  'På biblioteket': [
    {id: 100003, title: 'Er på mange biblioteker', custom: true},
    {id: 100005, title: 'Udlånes meget', custom: true},
    {id: -2, title: 'Bibliotekaren anbefaler', custom: true}
  ],
  Tempo: taxonomy.fortælleteknik.tempo,
  Fortællerstemme: taxonomy.fortælleteknik.fortællerstemme,
  'Handlingens tid': taxonomy.ramme['Handlingens tid i ord'],
  Univers: taxonomy.ramme.univers,
  Skrivestil: [
    leavesMap[5618],
    leavesMap[5619],
    leavesMap[5620],
    leavesMap[5621],
    leavesMap[5622],
    leavesMap[5623],
    leavesMap[5624],
    leavesMap[5625]
  ],
  Sprog: [
    leavesMap[5611],
    leavesMap[5610],
    leavesMap[5612],
    leavesMap[5616],
    leavesMap[5613],
    leavesMap[5614],
    leavesMap[5615],
    leavesMap[5617]
  ]
};
export const filtersMap = getLeavesMap(filters);
export const filtersMapAll = {...getLeavesMap(), ...filtersMap}; // all tags from taxonomy
export const filterIds = getLeaves(filters).map(f => f.id);
const defaultState = {
  editFilters: false,
  expandedFilters: {},
  filters,
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
export const TOGGLE_FILTER = 'TOGGLE_FILTER';

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
      const filterId = action.filterId;
      if (!filtersMapAll[filterId]) {
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
