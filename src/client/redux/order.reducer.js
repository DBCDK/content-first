const defaultState = {};

export const ORDER = 'ORDER';
export const ORDER_START = 'ORDER_START';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_FAILURE = 'ORDER_FAILURE';

const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ORDER: {
      const pid = action.book.pid;
      state = Object.assign({}, state);
      state[pid] = Object.assign({}, state[pid], action.book, {
        orderState: 'requested'
      });
      return state;
    }
    case ORDER_START: {
      const pid = action.pid;
      state = Object.assign({}, state);
      state[pid] = Object.assign({}, state[pid], {orderState: 'ordering'});
      return state;
    }
    case ORDER_SUCCESS: {
      const pid = action.pid;
      state = Object.assign({}, state);
      state[pid] = Object.assign({}, state[pid], {orderState: 'success'});
      return state;
    }
    case ORDER_FAILURE: {
      const pid = action.pid;
      state = Object.assign({}, state);
      state[pid] = Object.assign({}, state[pid], {orderState: 'failure'});
      return state;
    }
    default:
      return state;
  }
};

export default orderReducer;
