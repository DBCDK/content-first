import {taxonomy, getLeaves, getLeavesMap} from '../utils/taxonomy';
const leavesMap = getLeavesMap();
export const filters = {
  Stemning: [
    leavesMap[5636],
    leavesMap[5637],
    leavesMap[5647],
    leavesMap[5648],
    leavesMap[5660],
    leavesMap[5661],
    leavesMap[5657],
    leavesMap[5635],
    leavesMap[5663],
    leavesMap[5667],
    leavesMap[5670],
    leavesMap[5672],
    leavesMap[5676],
    leavesMap[5680],
    leavesMap[5688],
    leavesMap[5681],
    leavesMap[5699],
    leavesMap[5701],
    leavesMap[5700],
    leavesMap[5705],
    leavesMap[5708],
    leavesMap[5712],
    leavesMap[5735],
    leavesMap[5721],
    leavesMap[5725]
  ],
  Længde: [
    {id: 100000, title: 'Kort', custom: true},
    {id: 100001, title: 'Medium længde', custom: true},
    {id: 100002, title: 'Laaaaaaaaaaaaaaaang', custom: true}
  ],
  'På biblioteket': [
    {id: 100003, title: 'Er på mange biblioteker', custom: true},
    {id: 100005, title: 'Udlånes meget', custom: true},
    {id: -2, title: 'Bibliotekaren anbefaler', custom: true}
  ],
  Tempo: taxonomy.fortælleteknik.tempo,
  'Handlingens tid': [
    leavesMap[5734],
    leavesMap[4995],
    leavesMap[4970],
    leavesMap[5169],
    leavesMap[5016],
    leavesMap[4961]
  ],
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
  beltFilters: {
    'En god bog': [100001, 100003, {id: 5672, weight: 10}, 100005],
    'En spændende bog': [5676, 5632],
    'En anderledes bog': [5702],
    'Passer med min smag': [],
    'Mennesket og Naturen': [
      {id: 5329, weight: 10},
      {id: 3510, weight: 10},
      5734,
      5731,
      5280,
      5277,
      2183,
      2278
    ],
    'Familiens skyggesider': [
      {id: 1672, weight: 10},
      5734,
      {id: 5731, weight: 10},
      5699,
      5721,
      5696,
      5680,
      {id: 5691, weight: 10}
    ],
    'Tankevækkende Sci-fi': [{id: 4927, weight: 10}, 5714, 5713],
    'Bibliotekarens ugentlige anbefalinger': [-2],
    'Krøllede fortællinger': [
      {id: 2683, weight: 10},
      {id: 5614, weight: 10},
      5624,
      // 5653, uncomment when a work is mapped to this tag
      5652,
      // 5711, uncomment when a work is mapped to this tag
      5717
    ],
    Sofahygge: [
      {id: 5637, weight: 10},
      5654,
      5636,
      5731,
      {id: 5611, weight: 10}
    ],
    Tolkiensque: [
      {id: 6131, weight: 10},
      5726,
      5730,
      5704,
      5705,
      {id: 5707, weight: 10},
      5708
    ],
    'Gotisk uhygge': [
      4044,
      {id: 4895, weight: 10},
      5149,
      5680,
      {id: 5700, weight: 10},
      5670,
      5676
    ],
    Lokalkrimi: [
      2683,
      {id: 4907, weight: 10},
      {id: 5368, weight: 10},
      5734,
      5731,
      5670,
      5676,
      5691
    ],
    'Historisk romantik': [
      {id: 5028, weight: 10},
      5016,
      {id: 5149, weight: 10},
      4044,
      4074,
      5275,
      5282,
      189,
      {id: 5660, weight: 10},
      5661,
      5671
    ],
    'Vemodige nordmænd': [
      {id: 4466, weight: 10},
      5731,
      3510,
      5626,
      {id: 5683, weight: 10},
      5630
    ]
  },
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
