import {taxonomy, getLeaves, getLeavesMap} from '../utils/taxonomy';
const leavesMap = getLeavesMap();
export const filters = {
  Stemning: taxonomy.stemning,
  // Stemning: [
  //   leavesMap[5636],
  //   leavesMap[5637],
  //   leavesMap[5647],
  //   leavesMap[5648],
  //   leavesMap[5660],
  //   leavesMap[5661],
  //   leavesMap[5657],
  //   leavesMap[5635],
  //   leavesMap[5663],
  //   leavesMap[5667],
  //   leavesMap[5670],
  //   leavesMap[5672],
  //   leavesMap[5676],
  //   leavesMap[5680],
  //   leavesMap[5688],
  //   leavesMap[5681],
  //   leavesMap[5699],
  //   leavesMap[5701],
  //   leavesMap[5700],
  //   leavesMap[5705],
  //   leavesMap[5708],
  //   leavesMap[5712],
  //   leavesMap[5735],
  //   leavesMap[5721],
  //   leavesMap[5725]
  // ],
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
  'Handlingens tid': taxonomy.ramme['Handlingens tid'],
  // 'Handlingens tid': [
  //   leavesMap[5734],
  //   leavesMap[4995],
  //   leavesMap[4970],
  //   leavesMap[5169],
  //   leavesMap[5016],
  //   leavesMap[4961]
  // ],
  Struktur: [
    leavesMap[5621],
    leavesMap[5623],
    leavesMap[5625],
    leavesMap[5624]
  ],
  Skrivestil: [leavesMap[5611], leavesMap[5610], leavesMap[5612]]
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
