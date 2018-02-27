export const SYSTEM_LIST = 'SYSTEM_LIST';
export const SHORT_LIST = 'SHORT_LIST';
export const CUSTOM_LIST = 'CUSTOM_LIST';

// changeMap is a performance optimization used to easily determine
// if a work has been added/removed to/from list
const defaultState = {
  lists: {},
  changeMap: {}
};

export const LIST_LOAD_REQUEST = 'LIST_LOAD_REQUEST';
export const LIST_LOAD_RESPONSE = 'LIST_LOAD_RESPONSE';
export const ADD_LIST = 'ADD_LIST';
export const UPDATE_LIST_DATA = 'UPDATE_LIST_DATA';
export const REMOVE_LIST = 'REMOVE_LIST';
export const ADD_ELEMENT_TO_LIST = 'ADD_ELEMENT_TO_LIST';
export const REMOVE_ELEMENT_FROM_LIST = 'REMOVE_ELEMENT_FROM_LIST';
export const LIST_TOGGLE_ELEMENT = 'LIST_TOGGLE_ELEMENT';
export const LIST_INSERT_ELEMENT = 'LIST_INSERT_ELEMENT';
export const STORE_LIST = 'STORE_LIST';
export const ADD_LIST_IMAGE = 'ADD_LIST_IMAGE';
export const ADD_LIST_IMAGE_SUCCESS = 'ADD_LIST_IMAGE_SUCCESS';
export const ADD_LIST_IMAGE_ERROR = 'ADD_LIST_IMAGE_ERROR';

// eslint-disable-next-line
const listReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_LIST: {
      const {list} = action;
      if (!list.links.self) {
        throw new Error('Cant add list when list.links.self is not set');
      }
      if (!list.data.id) {
        throw new Error('Cant add list when list.data.id is not set');
      }
      return Object.assign({}, state, {
        lists: {...state.lists, [list.data.id]: list}
      });
    }
    case REMOVE_LIST: {
      if (!action.id) {
        throw new Error("'id' is missing from action");
      }
      const newLists = {...state.lists};
      delete newLists[action.id];
      return Object.assign({}, state, {lists: newLists});
    }
    case ADD_ELEMENT_TO_LIST: {
      if (!action.id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action.id]) {
        throw new Error(`Could not find list with id ${action.id}`);
      }
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }
      const changeMap = Object.assign({}, state.changeMap, {
        [action.element.book.pid]: {}
      });
      const list = {
        ...state.lists[action.id],
        data: {...state.lists[action.id].data}
      };
      if (
        list.data.list.filter(e => e.book.pid === action.element.book.pid)
          .length === 0
      ) {
        list.data.list = [...list.data.list, action.element];
      }
      return Object.assign({}, state, {
        lists: {...state.lists, [action.id]: list},
        changeMap
      });
    }
    case REMOVE_ELEMENT_FROM_LIST: {
      if (!action.id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action.id]) {
        throw new Error(`Could not find list with id ${action.id}`);
      }
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }
      const changeMap = Object.assign({}, state.changeMap, {
        [action.element.book.pid]: {}
      });
      const list = {
        ...state.lists[action.id],
        data: {...state.lists[action.id].data}
      };
      list.data.list = list.data.list.filter(
        element => element.book.pid !== action.element.book.pid
      );
      return Object.assign({}, state, {
        lists: {...state.lists, [action.id]: list},
        changeMap
      });
    }
    case LIST_INSERT_ELEMENT: {
      if (!action.id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action.id]) {
        throw new Error(`Could not find list with id ${action.id}`);
      }
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }
      if (!action.pos) {
        throw new Error("'pos' is missing from action");
      }
      const changeMap = Object.assign({}, state.changeMap, {
        [action.element.book.pid]: {}
      });
      const list = {
        ...state.lists[action.id],
        data: {...state.lists[action.id].data}
      };
      const listElements = [...list.data.list];
      listElements.splice(
        Math.min(action.pos, listElements.length),
        0,
        action.element
      );
      list.data.list = listElements.filter(
        (element, idx) =>
          !(element.book.pid === action.element.book.pid && idx !== action.pos)
      );
      return Object.assign({}, state, {
        lists: {...state.lists, [action.id]: list},
        changeMap
      });
    }
    case LIST_TOGGLE_ELEMENT: {
      if (!action.id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action.id]) {
        throw new Error(`Could not find list with id ${action.id}`);
      }
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }
      const changeMap = Object.assign({}, state.changeMap, {
        [action.element.book.pid]: {}
      });
      const list = {
        ...state.lists[action.id],
        data: {...state.lists[action.id].data}
      };
      const removed = list.data.list.filter(
        e => e.book.pid !== action.element.book.pid
      );
      if (removed.length < list.data.list.length) {
        list.data.list = removed;
      } else {
        list.data.list = [...list.data.list, action.element];
      }
      return Object.assign({}, state, {
        lists: {...state.lists, [action.id]: list},
        changeMap
      });
    }
    case UPDATE_LIST_DATA: {
      if (!action.data) {
        throw new Error("'data' is missing from action");
      }
      if (!state.lists[action.data.id]) {
        throw new Error(`Could not find list with id ${action.data.id}`);
      }
      const list = {...state.lists[action.data.id]};
      list.data = {...list.data, ...action.data};
      return Object.assign({}, state, {
        lists: {...state.lists, [action.data.id]: list}
      });
    }
    case LIST_LOAD_RESPONSE: {
      let lists = action.lists;
      const changeMap = lists.reduce((map, list) => {
        list.data.list.forEach(element => (map[element.book.pid] = {}));
        return map;
      }, {});
      const listMap = {};
      lists.forEach(l => {
        listMap[l.data.id] = l;
      });
      return Object.assign({}, state, {
        lists: listMap,
        changeMap
      });
    }
    case ADD_LIST_IMAGE: {
      validateId(state, action);
      const list = {...state.lists[action.id]};
      list.data = {
        ...list.data,
        imageIsLoading: true,
        image: null,
        imageError: null
      };
      return Object.assign({}, state, {
        lists: {...state.lists, [action.id]: list}
      });
    }
    case ADD_LIST_IMAGE_SUCCESS: {
      validateId(state, action);
      const list = {...state.lists[action.id]};
      list.data = {
        ...list.data,
        imageIsLoading: false,
        image: action.image.id,
        imageError: null
      };

      return Object.assign({}, state, {
        lists: {...state.lists, [action.id]: list}
      });
    }
    case ADD_LIST_IMAGE_ERROR: {
      validateId(state, action);
      const list = {...state.lists[action.id]};
      list.data = {
        ...list.data,
        imageIsLoading: true,
        image: null,
        imageError: action.error
      };
      return Object.assign({}, state, {
        lists: {...state.lists, [action.id]: list}
      });
    }
    default:
      return state;
  }
};

// ACTION CREATORS
export const addList = ({
  type = CUSTOM_LIST,
  title = '',
  description = '',
  list = [],
  id = null,
  owner = null
}) => {
  return {
    type: ADD_LIST,
    list: {
      data: {
        id,
        type,
        title,
        description,
        list,
        owner
      },
      links: {self: id ? `/v1/lists/${id}` : null}
    }
  };
};
export const updateList = data => {
  return {
    type: UPDATE_LIST_DATA,
    data
  };
};
export const removeList = id => {
  return {
    type: REMOVE_LIST,
    id
  };
};
export const addElementToList = (element, id) => {
  return {
    type: ADD_ELEMENT_TO_LIST,
    element,
    id
  };
};
export const removeElementFromList = (element, id) => {
  return {
    type: REMOVE_ELEMENT_FROM_LIST,
    element,
    id
  };
};
export const toggleElementInList = (element, id) => {
  return {
    type: LIST_TOGGLE_ELEMENT,
    element,
    id
  };
};
export const insertElement = (element, pos, id) => {
  return {
    type: LIST_INSERT_ELEMENT,
    element,
    pos,
    id
  };
};
export const storeList = id => {
  return {
    type: STORE_LIST,
    id
  };
};

// SELECTORS
export const getListsForOwner = (state, params = {}) => {
  if (!params.owner) {
    return [];
  }
  return getLists(state, params).filter(l => params.owner === l.data.owner);
};
export const getLists = (state, {type, sort} = {}) => {
  const lists = Object.values(state.lists).filter(l => {
    if (type && l.data.type !== type) {
      return false;
    }
    return true;
  });
  if (sort) {
    lists.sort((item1, item2) =>
      item1.data.title.localeCompare(item2.data.title)
    );
  }
  return lists;
};
export const getPublicLists = state => {
  return Object.values(state.lists).filter(l => l.data.public);
};

export const getListById = (state, id) => {
  return state.lists[id];
};
const validateId = (state, action) => {
  if (!action.id) {
    throw new Error("'id' is not defined");
  }
  if (!state.lists[action.id]) {
    throw new Error(`Could not find list with id ${action.id}`);
  }
};

export default listReducer;
