import {taxonomy, getLeaves, getLeavesMap} from '../utils/taxonomy';

export const filters = {
  'Vælg stemning': taxonomy.stemning,
  'Vælg længde': [
    {id: 100000, title: 'Kort', custom: true},
    {id: 100001, title: 'Medium længde', custom: true},
    {id: 100002, title: 'Laaaaaaaaaaaaaaaang', custom: true}
  ],
  'Vælg kvalitetsparametre': [
    {id: 100003, title: 'Er på mange biblioteker', custom: true},
    {id: -2, title: 'Bibliotekaren anbefaler', custom: true},
    {id: 100005, title: 'Udlånes meget', custom: true}
  ],
  'Vælg tempo': taxonomy.fortælleteknik.tempo
};
export const filtersMap = getLeavesMap(filters);
export const filtersMapAll = {...getLeavesMap(), ...filtersMap}; // all tags from taxonomy
export const filterIds = getLeaves(filters).map(f => f.id);
const defaultState = {
  editFilters: false,
  beltFilters: {
    'En god bog': [100001, 100003, 5672, 100005],
    'En spændende bog': [5676, 5632],
    'En anderledes bog': [5702],
    'Passer med min smag': [],
    'Mennesket og Naturen': [5329, 3510, 5734, 5731, 5280, 5277, 2183, 2278],
    'Familiens skyggesider': [1672, 5734, 5731, 5699, 5721, 5696, 5680, 5691],
    'Tankevækkende Sci-fi': [4927, 5714, 5713],
    'Bibliotekarens ugentlige anbefalinger': [-2],
    'Krøllede fortællinger': [
      2683,
      5614,
      5624,
      // 5653, uncomment when a work is mapped to this tag
      5652,
      // 5711, uncomment when a work is mapped to this tag
      5717
    ],
    Sofahygge: [5637, 5654, 5636, 5731, 5611],
    Tolkiensque: [6131, 5726, 5730, 5704, 5705, 5707, 5708],
    'Gotisk uhygge': [4044, 4895, 5149, 5680, 5700, 5670, 5676],
    Lokalkrimi: [2683, 4907, 5368, 5734, 5731, 5670, 5676, 5691],
    'Historisk romantik': [
      5028,
      5016,
      5149,
      4044,
      4074,
      5275,
      5282,
      189,
      5660,
      5661,
      5671
    ],
    'Vemodige nordmænd': [4466, 5731, 3510, 5626, 5683, 5630]
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
