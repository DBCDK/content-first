import uuid from 'small-uuid';

const defaultState = {
  lists: [],
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

const listReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_LIST: {
      const {list} = action;
      if (!list.id) {
        list.id = list.id || uuid.create();
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
      const currentList = state.currentList || {
        title: `Liste ${state.lists.length + 1}`,
        list: []
      };
      currentList.list = [action.element, ...currentList.list];
      return Object.assign({}, state, {currentList});
    }
    case REMOVE_ELEMENT_FROM_LIST: {
      const list = state.currentList.list.filter(
        element => element !== action.element
      );
      return Object.assign({}, state, {
        currentList: Object.assign({}, state.currentList, {list})
      });
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
      return Object.assign({}, state, {
        lists: action.lists,
        currentList: action.currentList || state.currentList
      });
    }
    default:
      return state;
  }
};

export default listReducer;
