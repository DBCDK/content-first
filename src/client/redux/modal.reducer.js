const defaultState = {
  addToList: {
    open: false,
    context: null
  },
  mergeShortList: {
    open: false,
    context: null
  }
};

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

const modalReducer = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return Object.assign({}, state, {
        [action.modal]: {open: true, context: action.context}
      });
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        [action.modal]: {open: false, context: null}
      });
    default:
      return state;
  }
};

export default modalReducer;
