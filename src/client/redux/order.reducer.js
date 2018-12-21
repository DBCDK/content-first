const defaultState = {
  orders: {},
  pickupBranches: []
};

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
      return {
        ...state,
        orders: {
          ...state.orders,
          [action.book.pid]: {...action.book, ordering: true}
        }
      };
    case AVAILABILITY:
      return {
        ...state,
        orders: {
          ...state.orders,
          [action.pid]: {
            ...state.orders[action.pid],
            availability: action.availability
          }
        }
      };

    case SET_CURRENT_BRANCH:
      return {
        ...state,
        currentBranch: action.branch
      };

    case ORDER_START:
      return {
        ...state,
        orders: {
          ...state.orders,
          [action.pid]: {...state.orders[action.pid], orderState: 'ordering'}
        }
      };

    case ORDER_SUCCESS:
      return {
        ...state,
        orders: {
          ...state.orders,
          [action.pid]: {...state.orders[action.pid], orderState: 'ordered'}
        }
      };

    case ORDER_FAILURE:
      return {
        ...state,
        orders: {
          ...state.orders,
          [action.pid]: {...state.orders[action.pid], orderState: 'error'}
        }
      };

    case ORDER_DONE: {
      let orders = state.orders;
      Object.values(orders).map(
        book =>
          book.orderState === 'error'
            ? delete book.orderState && delete book.ordering
            : delete book.ordering
      );
      return {
        ...state,
        orders: orders
      };
    }

    case PICKUP_BRANCHES:
      return {...state, pickupBranches: action.branches};

    default:
      return state;
  }
};

export default orderReducer;
