import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  orders: {},
  pickupBranches: []
});

export const ORDER = 'ORDER';
export const AVAILABILITY = 'AVAILABILITY';
export const SET_CURRENT_BRANCH = 'SET_CURRENT_BRANCH';
export const ORDER_START = 'ORDER_START';
export const ORDER_DONE = 'ORDER_DONE';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_FAILURE = 'ORDER_FAILURE';
export const PICKUP_BRANCHES = 'PICKUP_BRANCHES';

const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ORDER:
      return state
        .mergeIn(['orders', action.book.pid], Immutable.fromJS(action.book))
        .setIn(['orders', action.book.pid, 'ordering'], true);

    case AVAILABILITY:
      return state.setIn(
        ['orders', action.pid, 'availability'],
        Immutable.fromJS(action.availability)
      );

    case SET_CURRENT_BRANCH:
      return state.set('currentBranch', action.branch);

    case ORDER_START:
      return state.setIn(['orders', action.pid, 'orderState'], 'ordering');

    case ORDER_SUCCESS:
      return state.setIn(['orders', action.pid, 'orderState'], 'ordered');

    case ORDER_FAILURE:
      return state.setIn(['orders', action.pid, 'orderState'], 'error');

    case ORDER_DONE:
      return state.update('orders', orders =>
        orders.map(book =>
          book.get('orderState') === 'error'
            ? book.delete('orderState').delete('ordering')
            : book.delete('ordering')
        )
      );

    case PICKUP_BRANCHES:
      return state.set('pickupBranches', Immutable.fromJS(action.branches));

    default:
      return state;
  }
};

export default orderReducer;
