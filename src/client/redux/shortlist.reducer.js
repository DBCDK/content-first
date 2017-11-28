export const ON_SHORTLIST_ADD_ELEMENT = 'ON_SHORTLIST_ADD_ELEMENT';
export const ON_SHORTLIST_REMOVE_ELEMENT = 'ON_SHORTLIST_REMOVE_ELEMENT';
export const ON_SHORTLIST_TOGGLE_ELEMENT = 'ON_SHORTLIST_TOGGLE_ELEMENT';
export const ON_SHORTLIST_EXPAND = 'ON_SHORTLIST_EXPAND';
export const ON_SHORTLIST_COLLAPSE = 'ON_SHORTLIST_COLLAPSE';

const defaultState = {
  expanded: false,
  elements: []
};

const shortListReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ON_SHORTLIST_TOGGLE_ELEMENT: {
      const removed = state.elements.filter(e => e.book.pid !== action.element.book.pid);
      if (removed.length < state.elements.length) {
        return Object.assign({}, state, {elements: removed});
      }
      action.element.origin = action.origin;
      return Object.assign({}, state, {elements: [action.element, ...state.elements]});
    }
    case ON_SHORTLIST_ADD_ELEMENT: {
      const removed = state.elements.filter(e => e.book.pid !== action.element.book.pid);
      if (removed.length < state.elements.length) {
        return state;
      }
      action.element.origin = action.origin;
      return Object.assign({}, state, {elements: [action.element, ...state.elements]});
    }
    case ON_SHORTLIST_EXPAND:
      return Object.assign({}, state, {expanded: true});
    case ON_SHORTLIST_COLLAPSE:
      return Object.assign({}, state, {expanded: false});
    case ON_SHORTLIST_REMOVE_ELEMENT:
      return Object.assign({}, state, {elements: state.elements.filter(e => e.book.pid !== action.pid)});
    default:
      return state;
  }
};

export default shortListReducer;
