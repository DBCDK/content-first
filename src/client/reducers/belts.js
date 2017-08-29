const defaultState = {
  belts: [
    {
      name: 'Dummy belt',
      isLoading: false,
      works: [
        {title: 'A book'},
        {title: 'Another book'}
      ]
    },
    {
      name: 'Another dummy belt',
      isLoading: true,
      works: []
    }
  ]
};

export const ON_BELT_REQUEST = 'ON_BELT_LOAD';
export const ON_BELT_RESPONSE = 'ON_BELT_RESPONSE';

const beltsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_BELT_REQUEST:
      return state;
    case ON_BELT_RESPONSE:
      return state;
    default:
      return state;
  }
};

export default beltsReducer;
