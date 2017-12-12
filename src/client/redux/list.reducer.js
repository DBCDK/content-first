import uuid from 'small-uuid';

export const SYSTEM_LIST = 'SYSTEM_LIST';
export const SHORT_LIST = 'SHORT_LIST';
export const CUSTOM_LIST = 'CUSTOM_LIST';

const wannaReadList = {
  type: SYSTEM_LIST,
  id: 'har-læst-systemliste',
  title: 'Har læst',
  description: 'En liste over læste bøger',
  list: []
};
const didReadList = {
  type: SYSTEM_LIST,
  id: 'vil-læse-systemliste',
  title: 'Vil læse',
  description: 'En liste over bøger jeg gerne vil læse',
  list: []
};
const defaultState = {
  lists: [wannaReadList, didReadList],
  currentList: {
    title: '',
    description: '',
    list: []
  }
};

export const LIST_LOAD_REQUEST = 'LIST_LOAD_REQUEST';
export const LIST_LOAD_RESPONSE = 'LIST_LOAD_RESPONSE';
export const LIST_LOAD_CURRENT_LIST = 'LIST_LOAD_CURRENT_LIST';
export const ADD_LIST = 'ADD_LIST';
export const UPDATE_CURRENT_LIST = 'UPDATE_LIST';
export const SAVE_LIST = 'SAVE_LIST';
export const REMOVE_LIST = 'REMOVE_LIST';
export const ADD_ELEMENT_TO_LIST = 'ADD_ELEMENT_TO_LIST';
export const REMOVE_ELEMENT_FROM_LIST = 'REMOVE_ELEMENT_FROM_LIST';
export const LIST_TOGGLE_ELEMENT = 'LIST_TOGGLE_ELEMENT';

const listReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_LIST: {
      const {list} = action;
      if (!list.id) {
        list.id = uuid.create();
        return Object.assign({}, state, {lists: [...state.lists, list]});
      }
      const lists = state.lists.map(l => (l.id === list.id ? list : l));
      return Object.assign({}, state, {
        lists,
        currentList: defaultState.currentList
      });
    }
    case REMOVE_LIST: {
      return Object.assign({}, state, {currentList: defaultState.currentList});
    }
    case ADD_ELEMENT_TO_LIST: {
      if (action.id) {
        const lists = state.lists.map(l => {
          if (l.id === action.id) {
            return Object.assign({}, l, {list: [action.element, ...l.list]});
          }
          return l;
        });
        return Object.assign({}, state, {lists});
      }

      const currentList = state.currentList || {
        title: `Liste ${state.lists.length + 1}`,
        list: []
      };

      currentList.list = [action.element, ...currentList.list];
      return Object.assign({}, state, {currentList});
    }
    case REMOVE_ELEMENT_FROM_LIST: {
      const list = state.currentList.list.filter(
        element => element.book.pid !== action.element.book.pid
      );
      return Object.assign({}, state, {
        currentList: Object.assign({}, state.currentList, {list})
      });
    }
    case LIST_TOGGLE_ELEMENT: {
      const {id, element} = action;
      if (id) {
        const lists = state.lists.map(l => {
          if (l.id === id) {
            const removed = l.list.filter(e => e.book.pid !== element.book.pid);
            if (removed.length < l.list.length) {
              return Object.assign({}, l, {list: removed});
            }
            return Object.assign({}, l, {list: [element, ...l.list]});
          }
          return l;
        });
        return Object.assign({}, state, {lists});
      }
      return state;
    }
    case UPDATE_CURRENT_LIST: {
      const currentList = Object.assign(
        {},
        state.currentList,
        action.currentList
      );
      return Object.assign({}, state, {currentList});
    }
    case LIST_LOAD_CURRENT_LIST: {
      return Object.assign({}, state, {currentList: action.currentList});
    }
    case LIST_LOAD_RESPONSE: {
      let lists = action.lists;
      if (lists.filter((l) => l.id === wannaReadList.id).length === 0) {
        lists = [Object.assign({}, wannaReadList), ...lists];
      }
      if (lists.filter((l) => l.id === didReadList.id).length === 0) {
        lists = [Object.assign({}, didReadList), ...lists];
      }
      return Object.assign({}, state, {
        lists,
        currentList: action.currentList || state.currentList
      });
    }
    default:
      return state;
  }
};

export default listReducer;
