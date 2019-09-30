const defaultState = {
  order: {
    open: false,
    context: null,
    callback: null
  },
  login: {
    open: false,
    context: null,
    callback: null
  },
  profile: {
    open: false,
    context: null,
    callback: null
  },
  confirm: {
    open: false,
    context: null,
    callback: null
  },
  listSettings: {
    open: false,
    context: null,
    callback: null
  },
  reorderList: {
    open: false,
    context: null,
    callback: null
  },
  list: {
    open: false,
    context: null,
    callback: null
  },
  showReview: {
    open: false,
    context: null,
    callback: null
  },
  compare: {
    open: false,
    context: null,
    callback: null
  },
  notification: {
    open: false,
    context: null,
    callback: null
  }
};

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

/**
 * modalReducer
 * @param state
 * @param action
 * @returns {*}
 */
const modalReducer = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_MODAL: {
      return Object.assign({}, state, {
        [action.modal]: {
          open: true,
          context: action.context,
          callback: action.callback
        }
      });
    }
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        [action.modal]: {open: false, context: null}
      });
    default:
      return state;
  }
};

export default modalReducer;
