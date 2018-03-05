import {differenceBy} from 'lodash';
import {ON_LOGOUT_RESPONSE} from './user.reducer';
export const ON_SHORTLIST_ADD_ELEMENT = 'ON_SHORTLIST_ADD_ELEMENT';
export const SHORTLIST_UPDATE_ORIGIN = 'SHORTLIST_UPDATE_ORIGIN';
export const ON_SHORTLIST_REMOVE_ELEMENT = 'ON_SHORTLIST_REMOVE_ELEMENT';
export const ON_SHORTLIST_TOGGLE_ELEMENT = 'ON_SHORTLIST_TOGGLE_ELEMENT';
export const ON_SHORTLIST_EXPAND = 'ON_SHORTLIST_EXPAND';
export const ON_SHORTLIST_COLLAPSE = 'ON_SHORTLIST_COLLAPSE';
export const SHORTLIST_LOAD_REQUEST = 'SHORTLIST_LOAD_REQUEST';
export const SHORTLIST_LOAD_RESPONSE = 'SHORTLIST_LOAD_RESPONSE';
export const SHORTLIST_APPROVE_MERGE = 'SHORTLIST_APPROVE_MERGE';
export const SHORTLIST_REJECT_MERGE = 'SHORTLIST_REJECT_MERGE';
export const SHORTLIST_CLEAR = 'SHORTLIST_CLEAR';

const defaultState = {
  expanded: false,
  elements: [],
  isLoading: false,
  pendingMerge: null
};

const shortListReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SHORTLIST_APPROVE_MERGE:
      return Object.assign({}, state, {
        elements: [
          ...state.pendingMerge.diff,
          ...state.pendingMerge.databaseElements
        ],
        pendingMerge: null
      });
    case SHORTLIST_LOAD_REQUEST:
      return Object.assign({}, state, {elements: [], isLoading: true});
    case SHORTLIST_LOAD_RESPONSE: {
      const elements = action.databaseElements || action.localStorageElements;
      let pendingMerge = null;

      if (action.databaseElements) {
        // since databaseElements is set we might have a pending merge
        // lets check if there exist localStorageElements not contained in databaseElements
        const diff = differenceBy(
          action.localStorageElements,
          action.databaseElements,
          'book.pid'
        );
        if (diff.length > 0) {
          pendingMerge = {
            localStorageElements: action.localStorageElements,
            databaseElements: action.databaseElements,
            diff
          };
        }
      }

      return Object.assign({}, state, {
        elements,
        isLoading: false,
        pendingMerge
      });
    }
    case ON_SHORTLIST_TOGGLE_ELEMENT: {
      const removed = state.elements.filter(
        e => e.book.pid !== action.element.book.pid
      );
      if (removed.length < state.elements.length) {
        return Object.assign({}, state, {elements: removed});
      }
      action.element.origin = action.origin || '';
      return Object.assign({}, state, {
        elements: [action.element, ...state.elements]
      });
    }
    case ON_SHORTLIST_ADD_ELEMENT: {
      const removed = state.elements.filter(
        e => e.book.pid !== action.element.book.pid
      );
      if (removed.length < state.elements.length) {
        return state;
      }
      action.element.origin = action.origin || '';
      return Object.assign({}, state, {
        elements: [action.element, ...state.elements]
      });
    }
    case SHORTLIST_UPDATE_ORIGIN: {
      const elements = state.elements.map(e => {
        if (e.book.pid === action.pid) {
          return {...e, origin: action.origin || ''};
        }
        return e;
      });
      return Object.assign({}, state, {elements});
    }
    case ON_SHORTLIST_EXPAND:
      return Object.assign({}, state, {expanded: true});
    case ON_SHORTLIST_COLLAPSE:
      return Object.assign({}, state, {expanded: false});
    case ON_SHORTLIST_REMOVE_ELEMENT:
      return Object.assign({}, state, {
        elements: state.elements.filter(e => e.book.pid !== action.pid)
      });
    case SHORTLIST_CLEAR:
      return defaultState;
    case ON_LOGOUT_RESPONSE:
      return defaultState;
    default:
      return state;
  }
};

export default shortListReducer;
