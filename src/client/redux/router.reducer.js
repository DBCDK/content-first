export const ON_LOCATION_CHANGE = 'ON_LOCATION_CHANGE';

const routerReducer = (state = {}, action) => {
  switch (action.type) {
    case ON_LOCATION_CHANGE:
      return {path: action.path};
    default:
      return state;
  }
};

export default routerReducer;
