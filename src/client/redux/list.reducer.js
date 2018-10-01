import {uniqBy} from 'lodash';
import {createSelector} from 'reselect';

export const SYSTEM_LIST = 'SYSTEM_LIST';
export const SHORT_LIST = 'SHORT_LIST';
export const CUSTOM_LIST = 'CUSTOM_LIST';

// changeMap is a performance optimization used to easily determine
// if a work has been added/removed to/from list
const defaultState = {
  lists: {},
  changeMap: {},
  latestUsedId: false,
  expanded: false
};

export const LIST_LOAD_REQUEST = 'LIST_LOAD_REQUEST';
export const LIST_LOAD_RESPONSE = 'LIST_LOAD_RESPONSE';
export const LISTS_LOAD_REQUEST = 'LISTS_LOAD_REQUEST';
export const ADD_LIST = 'ADD_LIST';
export const UPDATE_LIST_DATA = 'UPDATE_LIST_DATA';
export const REMOVE_LIST = 'REMOVE_LIST';
export const REMOVE_LIST_SUCCESS = 'REMOVE_LIST_SUCCESS';
export const REMOVE_LIST_ERROR = 'REMOVE_LIST_ERROR';
export const ADD_ELEMENT_TO_LIST = 'ADD_ELEMENT_TO_LIST';
export const REMOVE_ELEMENT_FROM_LIST = 'REMOVE_ELEMENT_FROM_LIST';
export const UPDATE_LIST_ELEMENT = 'UPDATE_LIST_ELEMENT';
export const LIST_TOGGLE_ELEMENT = 'LIST_TOGGLE_ELEMENT';
export const LIST_INSERT_ELEMENT = 'LIST_INSERT_ELEMENT';
export const STORE_LIST = 'STORE_LIST';
export const ADD_LIST_IMAGE = 'ADD_LIST_IMAGE';
export const ADD_LIST_IMAGE_SUCCESS = 'ADD_LIST_IMAGE_SUCCESS';
export const ADD_LIST_IMAGE_ERROR = 'ADD_LIST_IMAGE_ERROR';

export const ON_USERLISTS_EXPAND = 'ON_USERLISTS_EXPAND';
export const ON_USERLISTS_COLLAPSE = 'ON_USERLISTS_COLLAPSE';
// eslint-disable-next-line
const listReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LIST_LOAD_REQUEST: {
      const {_id} = action;
      const old = state.lists[_id] || {};
      return Object.assign({}, state, {
        lists: {...state.lists, [_id]: {...old, isLoading: true, _id}}
      });
    }
    case ADD_LIST: {
      const {list} = action;
      if (!list._id) {
        throw new Error('Cant add list when list.data._id is not set');
      }
      return Object.assign({}, state, {
        lists: {...state.lists, [list._id]: list}
      });
    }
    case REMOVE_LIST: {
      if (!action._id) {
        throw new Error("'id' is missing from action");
      }

      const list = {
        ...state.lists[action._id],
        deletingIsLoading: true
      };

      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list}
      });
    }
    case REMOVE_LIST_SUCCESS: {
      if (!action._id) {
        throw new Error("'id' is missing from action");
      }

      const lists = {...state.lists};

      delete lists[action._id];

      return Object.assign({}, state, {lists});
    }
    case REMOVE_LIST_ERROR: {
      if (!action._id) {
        throw new Error("'id' is missing from action");
      }

      const list = {
        ...state.lists[action._id],
        error: action.error,
        deletingIsLoading: false
      };

      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list}
      });
    }
    case ADD_ELEMENT_TO_LIST: {
      if (!action._id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action._id]) {
        throw new Error(`Could not find list with _id ${action._id}`);
      }
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }

      action.element.pid = action.element.book.pid;

      const changeMap = Object.assign({}, state.changeMap, {
        [action.element.book.pid]: {}
      });

      const list = {
        ...state.lists[action._id]
      };

      if (
        list.list.filter(e => e.pid === action.element.book.pid).length === 0
      ) {
        if (!action.element.position) {
          action.element.position = {
            x: Math.floor(Math.random() * Math.floor(100)),
            y: Math.floor(Math.random() * Math.floor(100))
          };
        }
        list.list = [...list.list, action.element];
      }
      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list},
        changeMap
      });
    }
    case REMOVE_ELEMENT_FROM_LIST: {
      if (!action._id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action._id]) {
        throw new Error(`Could not find list with _id ${action._id}`);
      }
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }
      const changeMap = Object.assign({}, state.changeMap, {
        [action.element.book.pid]: {}
      });
      const list = {
        ...state.lists[action._id]
      };
      list.deleted = list.deleted || {};
      list.deleted[action.element._id] = true;
      list.pending = list.pending || [];
      list.pending = [...list.pending, action.element];
      list.list = list.list.filter(
        element => element.pid !== action.element.book.pid
      );
      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list},
        changeMap
      });
    }
    case LIST_INSERT_ELEMENT: {
      if (!action._id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action._id]) {
        throw new Error(`Could not find list with _id ${action._id}`);
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
        ...state.lists[action._id]
      };
      const listElements = [...list.list];
      listElements.splice(
        Math.min(action.pos, listElements.length),
        0,
        action.element
      );
      list.list = listElements.filter(
        (element, idx) =>
          !(element.book.pid === action.element.book.pid && idx !== action.pos)
      );
      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list},
        changeMap
      });
    }
    case LIST_TOGGLE_ELEMENT: {
      if (!action._id) {
        throw new Error("'id' is missing from action");
      }
      if (!state.lists[action._id]) {
        throw new Error(`Could not find list with _id ${action._id}`);
      }
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }
      const changeMap = Object.assign({}, state.changeMap, {
        [action.element.book.pid]: {}
      });
      const list = {
        ...state.lists[action._id]
      };
      const removed = list.list.filter(e => e.pid !== action.element.book.pid);
      if (removed.length < list.list.length) {
        list.list = removed;
      } else {
        action.element.pid = action.element.book.pid;
        list.list = [...list.list, action.element];
      }
      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list},
        changeMap
      });
    }
    case UPDATE_LIST_DATA: {
      if (!action.data) {
        throw new Error("'data' is missing from action");
      }
      if (!state.lists[action.data._id]) {
        throw new Error(`Could not find list with _id ${action.data._id}`);
      }
      const list = {...state.lists[action.data._id], ...action.data};
      return Object.assign({}, state, {
        lists: {...state.lists, [action.data._id]: list}
      });
    }
    case LIST_LOAD_RESPONSE: {
      if (!action.list || !action.list._id) {
        throw new Error("'list' is missing from action");
      }

      const list = action.list;
      if (list.list) {
        list.list.forEach(element => {
          if (!element.position) {
            element.position = {
              x: Math.floor(Math.random() * Math.floor(100)),
              y: Math.floor(Math.random() * Math.floor(100))
            };
          }
        });
      }
      list.isLoading = false;

      return Object.assign({}, state, {
        lists: {...state.lists, [action.list._id]: list}
      });
    }
    case ADD_LIST_IMAGE: {
      validateId(state, action);
      const list = {
        ...state.lists[action._id],
        imageIsLoading: true,
        imageError: null
      };
      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list}
      });
    }
    case UPDATE_LIST_ELEMENT: {
      validateId(state, action);
      if (!action.element) {
        throw new Error("'element' is missing from action");
      }
      const list = {
        ...state.lists[action._id]
      };
      list.list = list.list.map(element => {
        if (action.element._id === element._id) {
          return action.element;
        }
        return element;
      });

      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list}
      });
    }
    case ADD_LIST_IMAGE_SUCCESS: {
      validateId(state, action);
      const list = {
        ...state.lists[action._id],
        imageIsLoading: false,
        image: action.image.id,
        imageError: null
      };

      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list}
      });
    }
    case ADD_LIST_IMAGE_ERROR: {
      validateId(state, action);
      const list = {
        ...state.lists[action._id],
        imageIsLoading: true,
        image: null,
        imageError: action.error
      };
      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list}
      });
    }
    case STORE_LIST: {
      const list = {
        ...state.lists[action._id],
        pending: []
      };
      list._modified = null;
      return Object.assign({}, state, {
        lists: {...state.lists, [action._id]: list},
        latestUsedId: action._id
      });
    }
    case ON_USERLISTS_EXPAND:
      return Object.assign({}, state, {expanded: true});
    case ON_USERLISTS_COLLAPSE:
      return Object.assign({}, state, {expanded: false});

    default:
      return state;
  }
};

// ACTION CREATORS
export const addList = (
  {
    type = CUSTOM_LIST,
    title = '',
    description = '',
    isNew,
    list = [],
    _id = null,
    _owner = null,
    _created = Date.now()
  },
  afterSave
) => {
  return {
    type: ADD_LIST,
    list: {
      _id,
      type,
      title,
      description,
      isNew,
      list,
      _owner,
      _created
    },
    afterSave
  };
};
export const updateList = data => {
  return {
    type: UPDATE_LIST_DATA,
    data
  };
};
export const removeList = _id => {
  return {
    type: REMOVE_LIST,
    _id
  };
};
export const addElementToList = (element, _id) => {
  return {
    type: ADD_ELEMENT_TO_LIST,
    element,
    _id
  };
};
export const removeElementFromList = (element, _id) => {
  return {
    type: REMOVE_ELEMENT_FROM_LIST,
    element,
    _id
  };
};
export const toggleElementInList = (element, _id) => {
  return {
    type: LIST_TOGGLE_ELEMENT,
    element,
    _id
  };
};
export const insertElement = (element, pos, _id) => {
  return {
    type: LIST_INSERT_ELEMENT,
    element,
    pos,
    _id
  };
};
export const storeList = _id => {
  return {
    type: STORE_LIST,
    _id
  };
};

// SELECTORS
export const getListsForOwner = (state, params = {}) => {
  if (!params._owner) {
    return [];
  }
  return getLists(state, params).filter(l => params._owner === l._owner);
};

export const getLists = (state, {type, sort} = {}) => {
  const listState = state.listReducer;
  const booksState = state.booksReducer;

  const lists = Object.values(listState.lists)
    .filter(l => {
      if (type && l.type !== type) {
        return false;
      }
      if (!l.title) {
        return false;
      }
      return true;
    })
    .map(l => {
      if (l.type === SYSTEM_LIST) {
        /* eslint-disable */
        l.description =
          l.title === 'Har læst'
            ? 'Her kan du se listen over de bøger, som du har markeret som "Har læst". Du kan tilføje flere bøger til listen nederst på denne side. Du kan redigere og fjerne bøger, men ikke slette selve listen.'
            : 'Her kan du se listen over de bøger, som du har markeret som "Vil læse". Du kan tilføje flere bøger til listen nederst på denne side. Du kan redigere og fjerne bøger, men ikke slette selve listen.';
        l.image =
          l.title === 'Har læst'
            ? 'img/lists/goal.png'
            : 'img/lists/checklist.png';

        /* eslint-enable */
      }

      l.list = l.list.map(el => {
        return {...el, ...booksState.books[el.pid]};
      });

      // ensure uniqueness of elements
      // duplicates may exist, due to a previous bug #548
      l.list = uniqBy(l.list, 'pid');

      return l;
    });
  if (sort) {
    lists.sort((item1, item2) => item1.title.localeCompare(item2.title));
  }

  return lists;
};

export const getPublicLists = state => {
  return Object.values(state.lists)
    .filter(l => l.public)
    .sort(function(a, b) {
      return b._created - a._created;
    });
};

export const getListByIdSelector = () =>
  createSelector(
    [
      (state, {_id}) => {
        return state.listReducer.lists[_id];
      },
      state => state.booksReducer
    ],
    (list, booksState) => {
      if (!list) {
        return;
      }

      list = {...list};

      if (list && list.list) {
        list.list = list.list
          .filter(el => {
            return booksState.books[el.pid] && booksState.books[el.pid].book;
          })
          .map(el => {
            return {...el, book: booksState.books[el.pid].book};
          });

        // ensure uniqueness of elements
        // duplicates may exist, due to a previous bug #548
        list.list = uniqBy(list.list, 'pid');
      }
      return list;
    }
  );

const validateId = (state, action) => {
  if (!action._id) {
    throw new Error("'_id' is not defined");
  }
  if (!state.lists[action._id]) {
    throw new Error(`Could not find list with _id ${action._id}`);
  }
};

export default listReducer;
