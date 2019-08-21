import request from 'superagent';
import {throttle, get, difference} from 'lodash';
import unique from '../utils/unique';
import {BOOKS_REQUEST, BOOKS_PARTIAL_UPDATE} from './books.reducer';
import {
  fetchBooks,
  fetchBooksRefs,
  fetchBooksTags,
  fetchReviews,
  fetchCollection,
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
  REMOVE_LIST,
  STORE_LIST,
  LIST_LOAD_RESPONSE,
  LIST_LOAD_REQUEST,
  FOLLOWED_LISTS_REQUEST,
  OWNED_LISTS_REQUEST,
  // OWNED_LISTS_RESPONSE,
  LIST_TOGGLE_ELEMENT,
  ADD_LIST_IMAGE,
  ADD_LIST_IMAGE_SUCCESS,
  ADD_LIST_IMAGE_ERROR,
  ADD_ELEMENT_TO_LIST,
  getListByIdSelector
} from './list.reducer';
import {
  saveList,
  loadList
  // loadLists
} from '../utils/requestLists';

const getListById = getListByIdSelector();

export const HISTORY_PUSH = 'HISTORY_PUSH';
export const HISTORY_PUSH_FORCE_REFRESH = 'HISTORY_PUSH_FORCE_REFRESH';
export const HISTORY_REPLACE = 'HISTORY_REPLACE';
export const HISTORY_NEW_TAB = 'HISTORY_NEW_TAB';

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
        if (action.path !== '') {
          window.scrollTo(0, 0);
        }
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
      if (action.path !== '') {
        window.scrollTo(0, 0);
      }
      break;
    }
    default:
      return next(action);
  }
};

const partialUpdateRequest = async (name, pids, requestFunction, store) => {
  pids = unique(pids);
  const books = store.getState().booksReducer.books;
  const pidsToFetch = pids.filter(
    pid =>
      !get(books[pid], `${name}HasLoaded`) &&
      !get(books[pid], `${name}IsLoading`)
  );
  if (pidsToFetch.length === 0) {
    return pidsToFetch;
  }
  store.dispatch({
    type: BOOKS_PARTIAL_UPDATE,
    books: pidsToFetch.map(pid => {
      return {
        book: {pid},
        [`${name}IsLoading`]: true,
        [`${name}HasLoaded`]: false
      };
    })
  });
  const response = await requestFunction(pidsToFetch, store);

  store.dispatch({
    type: BOOKS_PARTIAL_UPDATE,
    books: response.map(work => ({
      ...work,
      [`${name}IsLoading`]: false,
      [`${name}HasLoaded`]: true
    }))
  });
  return pidsToFetch;
};
const createDebouncedFunction = (name, requestFunction) => {
  let pidQueue = [];
  let debounced = throttle(store => {
    const pidQueueCopy = [...pidQueue];
    partialUpdateRequest(name, pidQueueCopy, requestFunction, store);
    pidQueue = difference(pidQueue, pidQueueCopy);
  }, 100);
  return (pids, store) => {
    pidQueue = [...pidQueue, ...pids];
    debounced(store);
  };
};
const debouncedFunctions = {
  details: createDebouncedFunction('details', fetchBooks),
  tags: createDebouncedFunction('tags', fetchBooksTags)
};

export const requestMiddleware = store => next => action => {
  switch (action.type) {
    case BOOKS_REQUEST:
      (async () => {
        const {includeTags, includeReviews, includeCollection} = action;

        debouncedFunctions.details(action.pids, store);
        if (includeTags) {
          debouncedFunctions.tags(action.pids, store);
        }

        if (includeReviews || includeCollection) {
          // we await the refs request, since the following requests depends on it to be complete
          const fetchedPids = await partialUpdateRequest(
            'refs',
            action.pids,
            fetchBooksRefs,
            store
          );
          // we continue with the actual fetched pids to avoid
          // multiple simultanous requests messing up
          // and trying to fetch reviews before collection is loaded
          if (includeReviews) {
            partialUpdateRequest('reviews', fetchedPids, fetchReviews, store);
          }
          if (includeCollection) {
            partialUpdateRequest(
              'collection',
              fetchedPids,
              fetchCollection,
              store
            );
          }
        }
      })();

      return next(action);
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
      const {localStorageElements, databaseElements} = await loadShortList({
        isLoggedIn,
        dispatch: store.dispatch
      });
      store.dispatch({
        type: SHORTLIST_LOAD_RESPONSE,
        localStorageElements,
        databaseElements
      });
      if (store.getState().shortListReducer.pendingMerge) {
        store.dispatch({type: SHORTLIST_APPROVE_MERGE});
      }
      store.dispatch({
        type: BOOKS_REQUEST,
        pids: store.getState().shortListReducer.elements.map(e => e.pid)
      });
      return res;
    }
    default:
      return next(action);
  }
};

export const listMiddleware = store => next => async action => {
  switch (action.type) {
    case STORE_LIST: {
      const {openplatformId} = store.getState().userReducer;
      const list = getListById(store.getState(), {_id: action._id});
      if (!list) {
        throw new Error(`list with _id ${action._id} not found`);
      }
      if (store.getState().userReducer.isLoggedIn) {
        const updatedList = await saveList(list, openplatformId);
        store.dispatch({
          type: ADD_LIST,
          list: updatedList
        });
      }
      return next(action);
    }
    case ADD_LIST: {
      // if (!action.list._id) {
      //   const {openplatformId} = store.getState().userReducer;
      //   action.list = await saveList(action.list, openplatformId);
      //   if (action.afterSave) {
      //     action.afterSave(action.list);
      //   }
      // }
      // // if (!action.list.owner) {
      // //   action.list.owner = store.getState().userReducer.openplatformId;
      // // }
      return next(action);
    }
    case REMOVE_LIST: {
      // const _id = action._id;
      //
      // (async () => {
      //   try {
      //     await deleteObject({_id});
      //     store.dispatch({type: REMOVE_LIST_SUCCESS, _id});
      //   } catch (error) {
      //     store.dispatch({type: REMOVE_LIST_ERROR, error, _id});
      //   }
      // })();
      return next(action);
    }

    case LIST_TOGGLE_ELEMENT:
    case ADD_ELEMENT_TO_LIST: {
      // TODO: should be moved to the withList.hoc
      const {openplatformId} = store.getState().userReducer;
      action.element._owner = openplatformId;
      return next(action);
    }
    case LIST_LOAD_REQUEST: {
      const res = next(action);
      try {
        const list = await loadList(action._id, store);

        store.dispatch({
          type: LIST_LOAD_RESPONSE,
          list
        });

        const pids = [];
        list.list.forEach(book => {
          pids.push(book.pid);
        });

        store.dispatch({type: BOOKS_REQUEST, pids});
        store.dispatch({type: REQUEST_USER, id: list._owner});
        list.list.forEach(element => {
          store.dispatch({type: REQUEST_USER, id: element._owner});
        });
      } catch (error) {
        store.dispatch({
          type: LIST_LOAD_RESPONSE,
          list: {_id: action._id || 'unknown', error}
        });
      }
      return res;
    }
    case FOLLOWED_LISTS_REQUEST: {
      const res = next(action);
      // const listIds = Object.values(store.getState().followReducer)
      //   .filter(follow => follow.cat === 'list')
      //   .map(f => f.id);
      // const lists = store.getState().listReducer.lists;
      // listIds
      //   .filter(_id => !lists[_id])
      //   .forEach(_id => store.dispatch({type: LIST_LOAD_REQUEST, _id}));

      return res;
    }
    case OWNED_LISTS_REQUEST: {
      const res = next(action);
      // const {openplatformId} = store.getState().userReducer;
      // const lists = await loadLists({openplatformId});
      //
      // const allLists = [...lists];
      // allLists.forEach(list => {
      //   store.dispatch({
      //     type: LIST_LOAD_RESPONSE,
      //     list
      //   });
      // });
      //
      // let pids = [];
      // allLists.forEach(list => {
      //   list.list.forEach(book => {
      //     pids.push(book.pid);
      //   });
      // });
      //
      // store.dispatch({type: BOOKS_REQUEST, pids});
      //
      // for (const list of [...lists]) {
      //   store.dispatch({type: REQUEST_USER, id: list._owner});
      //   list.list.forEach(element => {
      //     store.dispatch({type: REQUEST_USER, id: element._owner});
      //   });
      // }
      //
      // store.dispatch({type: FOLLOWED_LISTS_REQUEST});
      // store.dispatch({
      //   type: OWNED_LISTS_RESPONSE
      // });

      return res;
    }
    case ADD_LIST_IMAGE:
      next(action);
      return (async () => {
        try {
          const image = await addImage(action.image);
          store.dispatch({
            type: ADD_LIST_IMAGE_SUCCESS,
            image,
            _id: action._id
          });
        } catch (error) {
          store.dispatch({type: ADD_LIST_IMAGE_ERROR, error, _id: action._id});
        }
      })();
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
  LIST_TOGGLE_ELEMENT: ({type, element, _id}) => ({
    type,
    pid: element.book.pid,
    _id
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
