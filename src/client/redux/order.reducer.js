import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  orders: {},
  pickupBranches: []
});

export const ORDER = 'ORDER';
export const AVAILABILITY = 'AVAILABILITY';
export const ORDER_START = 'ORDER_START';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_FAILURE = 'ORDER_FAILURE';

const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ORDER:
      return state
        .setIn(['orders', action.book.pid], Immutable.fromJS(action.book))
        .setIn(['orders', action.book.pid, 'orderState'], 'requested');
    case AVAILABILITY:
      return state.setIn(
        ['orders', action.pid, 'availability'],
        Immutable.fromJS(action.availability)
      );
    case ORDER_START: {
      return state.setIn(['orders', action.pid, 'orderState'], 'ordering');
    }
    case ORDER_SUCCESS: {
      return state.setIn(['orders', action.pid, 'orderState'], 'ordered');
    }
    case ORDER_FAILURE: {
      return state.setIn(['orders', action.pid, 'orderState'], 'error');
    }
    default:
      return state;
  }
};

export default orderReducer;
