import uuid from 'small-uuid';

export const SYSTEM_LIST = 'SYSTEM_LIST';
export const SHORT_LIST = 'SHORT_LIST';
export const CUSTOM_LIST = 'CUSTOM_LIST';

// changeMap is a performance optimization used to easily determine
// if a work has been added/removed to/from list
const defaultState = {
  lists: {},
  currentList: {
    title: '',
    description: '',
    list: []
  },
  changeMap: {},
  recent: [
    {
      type: CUSTOM_LIST,
      id: 'test1',
      userId: 'user1',
      title: 'Goth du bør læse før eller siden',
      description: 'bla blabela bla bla blaa bla bla bla bla bla, og bla sdfioi sdflkn sd fl sdldj sldfj salj sdf lsd flj sdgflj bla, og mere blah meget lang tekst dether',
      list: [
        {
          pid: '870970-basis:51319079'
        },
        {
          pid: '870970-basis:52930006'
        },
        {
          pid: '870970-basis:52530423'
        },
        {
          pid: '870970-basis:52530423'
        }
      ]
    },
    {
      type: CUSTOM_LIST,
      id: 'test2',
      userId: 'user2',
      title: 'Bøger om bjørne - med meget lang titel',
      description: 'mange bjørne',
      list: [
        {
          pid: '870970-basis:51319079'
        },
        {
          pid: '870970-basis:52930006'
        }
      ]
    },
    {
      type: CUSTOM_LIST,
      id: 'test3',
      userId: 'user1',
      title: 'Goth du bør læse før eller siden',
      description: 'bla blabela bla bla blaa bla bla bla bla bla, og bla sdfioi sdflkn sd fl sdldj sldfj salj sdf lsd flj sdgflj bla, og mere blah meget lang tekst dether',
      list: [
        {
          pid: '870970-basis:51319079'
        }
      ]
    },
    {
      type: CUSTOM_LIST,
      id: 'test4',
      userId: 'user2',
      title: 'Bøger om bjørne - med meget lang titel',
      description: 'mange bjørne',
      list: []
    },
    {
      type: CUSTOM_LIST,
      id: 'test5',
      userId: 'user1',
      title: 'Goth du bør læse før eller siden',
      description: 'bla blabela bla bla blaa bla bla bla bla bla, og bla sdfioi sdflkn sd fl sdldj sldfj salj sdf lsd flj sdgflj bla, og mere blah meget lang tekst dether',
      list: []
    },
    {
      type: CUSTOM_LIST,
      id: 'test6',
      userId: 'user2',
      title: 'Bøger om bjørne - med meget lang titel',
      description: 'mange bjørne',
      list: []
    },
    {
      type: CUSTOM_LIST,
      id: 'test7',
      userId: 'user1',
      title: 'Goth du bør læse før eller siden',
      description: 'bla blabela bla bla blaa bla bla bla bla bla, og bla sdfioi sdflkn sd fl sdldj sldfj salj sdf lsd flj sdgflj bla, og mere blah meget lang tekst dether',
      list: []
    },
    {
      type: CUSTOM_LIST,
      id: 'test8',
      userId: 'user2',
      title: 'Bøger om bjørne - med meget lang titel',
      description: 'mange bjørne',
      list: []
    }
  ]
};

export const LIST_LOAD_REQUEST = 'LIST_LOAD_REQUEST';
export const LIST_LOAD_RESPONSE = 'LIST_LOAD_RESPONSE';
export const LIST_LOAD_CURRENT_LIST = 'LIST_LOAD_CURRENT_LIST';
export const ADD_LIST = 'ADD_LIST';
export const UPDATE_CURRENT_LIST = 'UPDATE_LIST';
export const CLEAR_CURRENT_LIST = 'CLEAR_CURRENT_LIST';
export const SAVE_LIST = 'SAVE_LIST';
export const REMOVE_LIST = 'REMOVE_LIST';
export const ADD_ELEMENT_TO_LIST = 'ADD_ELEMENT_TO_LIST';
export const REMOVE_ELEMENT_FROM_LIST = 'REMOVE_ELEMENT_FROM_LIST';
export const LIST_TOGGLE_ELEMENT = 'LIST_TOGGLE_ELEMENT';

const listReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_LIST: {
      const {list} = action;
      if (!list.links.self) {
        throw new Error('Cant add list when list.links.self is not set');
      }
      return Object.assign({}, state, {
        lists: {...state.lists, [list.links.self]: list}
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
      const list = {...state.lists[action.id], data: {...state.lists[action.id].data}};
      if (list.data.list.filter(e => e.book.pid === action.element.book.pid).length === 0) {
        list.data.list = [...list.data.list, action.element];
      }
      return Object.assign({}, state, {lists: {...state.lists, [action.id]: list}, changeMap});
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
      const list = {...state.lists[action.id], data: {...state.lists[action.id].data}};
      list.data.list = list.data.list.filter(element => element.book.pid !== action.element.book.pid);
      return Object.assign({}, state, {lists: {...state.lists, [action.id]: list}, changeMap});
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
      const list = {...state.lists[action.id], data: {...state.lists[action.id].data}};
      const removed = list.data.list.filter(e => e.book.pid !== action.element.book.pid);
      if (removed.length < list.data.list.length) {
        list.data.list = removed;
      } else {
        list.data.list = [...list.data.list, action.element];
      }
      return Object.assign({}, state, {lists: {...state.lists, [action.id]: list}, changeMap});
    }
    case UPDATE_CURRENT_LIST: {
      const currentList = Object.assign({}, state.currentList, action.currentList);
      return Object.assign({}, state, {currentList});
    }
    case LIST_LOAD_CURRENT_LIST: {
      return Object.assign({}, state, {currentList: action.currentList});
    }
    case CLEAR_CURRENT_LIST: {
      return Object.assign({}, state, {currentList: defaultState.currentList});
    }
    case LIST_LOAD_RESPONSE: {
      let lists = action.lists;
      const changeMap = lists.reduce((map, list) => {
        list.data.list.forEach(element => (map[element.book.pid] = {}));
        return map;
      }, {});
      return Object.assign({}, state, {
        lists,
        currentList: action.currentList || state.currentList || defaultState.currentList,
        changeMap
      });
    }
    default:
      return state;
  }
};

// ACTION CREATORS
export const addList = ({type = CUSTOM_LIST, title = '', description = '', list = []}) => {
  return {
    type: ADD_LIST,
    list: {
      data: {
        type,
        title,
        description,
        list
      },
      links: {self: null}
    }
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

// SELECTORS
export const getLists = (state, {type} = {}) => {
  if (!type) {
    return Object.values(state.lists);
  }
  return Object.values(state.lists).filter(l => l.data.type === type);
};
export const getListMap = state => {
  return state.lists;
};

export default listReducer;
