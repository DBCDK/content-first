const defaultState = {};

export const ORDER = 'ORDER';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_FAILURE = 'ORDER_FAILURE';

const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ORDER:
      state = Object.assign({}, state);
      state[action.pid] = {state: 'ordering'};
      return state;
    case ORDER_SUCCESS:
      state = Object.assign({}, state);
      state[action.pid] = {state: 'ordered'};
      return state;
    case ORDER_FAILURE:
      state = Object.assign({}, state);
      state[action.pid] = {state: 'error'};
      return state;
    default:
      return state;
  }
};

export default orderReducer;
