const defaultState = {
  enabledFilters: [2, 0],
  filters: [
    {
      title: 'Længde',
      options: [
        {title: 'Kort bog', selected: true},
        {title: 'Medium længde'},
        {title: 'Lang bog'}
      ]
    },
    {
      title: 'et filter',
      options: [
        {title: 'Herlige bøger', selected: true},
        {title: 'Ik\' så herlige bøger'}
      ]
    },
    {
      title: 'Kvalitetsparametre',
      options: [
        {title: 'Gode anmeldelser', selected: true},
        {title: 'Gode ratings'}
      ]
    }
  ],
  isLoading: false,
  works: [
    {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg',
      metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'},
    {title: 'A book', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg',
      metakompasDescription: 'Kort og stærk roman satirisk sorgroman reflekteret poetisk samfundskritik'}
  ]
};

export const ON_FILTER_REQUEST = 'ON_FILTER_REQUEST';
export const ON_FILTER_RESPONSE = 'ON_FILTER_RESPONSE';
export const ON_OPTION_SELECT = 'ON_OPTION_SELECT';
export const ON_ENABLE_FILTER = 'ON_ENABLE_FILTER';
export const ON_DISABLE_FILTER = 'ON_DISABLE_FILTER';

const filterReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_FILTER_REQUEST:
      return state;
    case ON_FILTER_RESPONSE:
      return state;
    case ON_OPTION_SELECT: {
      const filters = state.filters.map((filter) => {
        if (filter.title === action.filterTitle) {
          filter.options = filter.options.map(o => {
            return {
              title: o.title,
              selected: o.title === action.value
            };
          });
        }
        return filter;
      });
      return Object.assign({}, state, {filters});
    }
    case ON_DISABLE_FILTER: {
      const enabledFilters = state.enabledFilters.filter(id => {
        return state.filters[id].title !== action.filterTitle;
      });
      return Object.assign({}, state, {enabledFilters});
    }
    default:
      return state;
  }
};

export default filterReducer;
