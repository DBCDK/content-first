import request from 'superagent';
import {ON_WORK_REQUEST} from './work.reducer';
import {BOOKS_REQUEST} from './books.reducer';
import {
  fetchBooks,
  fetchWork,
  fetchSearchResults,
  saveShortList,
  loadShortList,
  addImage
} from '../utils/requester';
import {ON_LOGOUT_RESPONSE} from './user.reducer';
import {
  ON_SHORTLIST_ADD_ELEMENT,
  SHORTLIST_UPDATE_ORIGIN,
  ON_SHORTLIST_REMOVE_ELEMENT,
  ON_SHORTLIST_TOGGLE_ELEMENT,
  SHORTLIST_LOAD_REQUEST,
  SHORTLIST_LOAD_RESPONSE,
  SHORTLIST_APPROVE_MERGE,
  SHORTLIST_CLEAR
} from './shortlist.reducer';
import {REQUEST_USER} from './users';
import {
  ADD_LIST,
  STORE_LIST,
  LIST_LOAD_RESPONSE,
  LIST_LOAD_REQUEST,
  getListById,
  ADD_LIST_IMAGE,
  ADD_LIST_IMAGE_SUCCESS,
  ADD_LIST_IMAGE_ERROR
} from './list.reducer';
import {OPEN_MODAL} from './modal.reducer';
import {SEARCH_QUERY} from './search.reducer';
import {saveList, loadLists, loadRecentPublic} from '../utils/requestLists';

export const HISTORY_PUSH = 'HISTORY_PUSH';
export const HISTORY_PUSH_FORCE_REFRESH = 'HISTORY_PUSH_FORCE_REFRESH';
export const HISTORY_REPLACE = 'HISTORY_REPLACE';

const paramsToString = params => {
  let res = '';
  Object.keys(params).forEach(key => {
    if (Array.isArray(params[key])) {
      params[key].forEach(value => {
        const separator = res === '' ? '?' : '&';
        res += `${separator}${key}=${value}`;
      });
    } else {
      const separator = res === '' ? '?' : '&';
      res += `${separator}${key}=${params[key]}`;
    }
  });
  return res;
};

export const historyMiddleware = history => store => next => action => {
  switch (action.type) {
    case HISTORY_PUSH:
      if (store.getState().routerReducer.path !== action.path) {
        const paramsString = action.params ? paramsToString(action.params) : '';
        history.push(action.path + paramsString);
        window.scrollTo(0, 0);
      }
      break;
    case HISTORY_PUSH_FORCE_REFRESH:
      if (store.getState().routerReducer.path !== action.path) {
        const paramsString = action.params ? paramsToString(action.params) : '';
        window.location.href = action.path + paramsString;
      }
      break;
    case HISTORY_REPLACE: {
      const paramsString = action.params ? paramsToString(action.params) : '';
      history.replace(action.path + paramsString);
      window.scrollTo(0, 0);
      break;
    }
    default:
      return next(action);
  }
};

export const requestMiddleware = store => next => action => {
  switch (action.type) {
    case ON_WORK_REQUEST: {
      fetchWork(action.pid, store.dispatch);
      return next(action);
    }
    case BOOKS_REQUEST: {
      fetchBooks(action.pids, store.dispatch);
      return next(action);
    }
    default:
      return next(action);
  }
};

export const shortListMiddleware = store => next => async action => {
  switch (action.type) {
    case SHORTLIST_CLEAR:
    case SHORTLIST_APPROVE_MERGE:
    case ON_LOGOUT_RESPONSE:
    case ON_SHORTLIST_ADD_ELEMENT:
    case ON_SHORTLIST_REMOVE_ELEMENT:
    case ON_SHORTLIST_TOGGLE_ELEMENT:
    case SHORTLIST_UPDATE_ORIGIN: {
      const res = next(action);
      const {elements} = store.getState().shortListReducer;
      const {isLoggedIn} = store.getState().userReducer;
      saveShortList(elements, isLoggedIn);
      return res;
    }
    case SHORTLIST_LOAD_REQUEST: {
      const res = next(action);
      const {isLoggedIn} = store.getState().userReducer;
      const {localStorageElements, databaseElements} = await loadShortList(
        isLoggedIn
      );
      store.dispatch({
        type: SHORTLIST_LOAD_RESPONSE,
        localStorageElements,
        databaseElements
      });
      if (store.getState().shortListReducer.pendingMerge) {
        store.dispatch({
          type: OPEN_MODAL,
          modal: 'mergeShortList'
        });
      }
      return res;
    }
    default:
      return next(action);
  }
};

export const listMiddleware = store => next => async action => {
  switch (action.type) {
    case STORE_LIST: {
      const res = next(action);
      const list = getListById(store.getState().listReducer, action.id);
      if (!list) {
        throw new Error(`list with id ${action.id} not found`);
      }
      if (store.getState().userReducer.isLoggedIn) {
        const updatedList = await saveList(list);
        store.dispatch({
          type: ADD_LIST,
          id: updatedList.id,
          list: updatedList
        });
      }
      return res;
    }
    case ADD_LIST: {
      if (!action.list.id) {
        action.list = await saveList(action.list);
      }
      if (!action.list.owner) {
        action.list.owner = store.getState().userReducer.openplatformId;
      }
      return next(action);
    }
    case LIST_LOAD_REQUEST: {
      const res = next(action);
      const {openplatformId} = store.getState().userReducer;
      const lists = await loadLists(openplatformId);
      const recentLists = await loadRecentPublic();
      store.dispatch({
        type: LIST_LOAD_RESPONSE,
        lists: [...lists, ...recentLists]
      });

      for (const list of [...lists, ...recentLists]) {
        store.dispatch({type: REQUEST_USER, id: list.owner});
      }

      return res;
    }
    case ADD_LIST_IMAGE:
      next(action);
      return (async () => {
        try {
          const image = await addImage(action.image);
          store.dispatch({type: ADD_LIST_IMAGE_SUCCESS, image, id: action.id});
        } catch (error) {
          store.dispatch({type: ADD_LIST_IMAGE_ERROR, error, id: action.id});
        }
      })();
    default:
      return next(action);
  }
};

export const searchMiddleware = store => next => action => {
  switch (action.type) {
    case SEARCH_QUERY:
      fetchSearchResults({query: action.query, dispatch: store.dispatch});
      return next(action);
    default:
      return next(action);
  }
};

const logged = {
  ON_LOCATION_CHANGE: ({type, path}) => ({type, path}),
  ON_SHORTLIST_TOGGLE_ELEMENT: ({type, element, origin}) => ({
    type,
    pid: element.book.pid,
    origin
  }),
  LIST_TOGGLE_ELEMENT: ({type, element, id}) => ({
    type,
    pid: element.book.pid,
    id
  }),
  ORDER: ({type, book}) => ({type, pid: book.pid}),
  ORDER_SUCCESS: o => o,
  ORDER_FAILURE: o => o,
  LOG_ERROR: o => o,
  LOG: o => o
};
export const logMiddleware = store => next => action => {
  if (logged[action.type]) {
    try {
      request
        .post('/v1/log')
        .send(logged[action.type](action, store))
        .end();
    } catch (e) {
      request
        .post('/v1/log')
        .send({type: action.type, error: 'CLIENT_LOG_ERROR', msg: String(e)})
        .end();
    }
  }
  return next(action);
};
