import {ON_BELT_REQUEST} from './belts.reducer';
import {ON_WORK_REQUEST} from './work.reducer';
import {
  fetchBeltWorks,
  fetchWork,
  fetchUser,
  fetchProfileRecommendations,
  fetchSearchResults,
  logout,
  saveShortList,
  loadShortList
} from '../utils/requester';
import {
  ON_PROFILE_LOAD_PROFILES_RESPONSE,
  ON_USER_DETAILS_REQUEST,
  ON_ADD_PROFILE_ELEMENT,
  ON_REMOVE_PROFILE_ELEMENT,
  ON_ADD_PROFILE_ARCHETYPE,
  ON_PROFILE_REMOVE_CURRENT_PROFILE,
  ON_PROFILE_CREATE_TASTE,
  ON_PROFILE_LOAD_PROFILES,
  ON_LOGOUT_REQUEST,
  ON_LOGOUT_RESPONSE
} from './profile.reducer';
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
import {
  ADD_LIST,
  REMOVE_LIST,
  LIST_LOAD_RESPONSE,
  LIST_LOAD_REQUEST,
  ADD_ELEMENT_TO_LIST,
  LIST_TOGGLE_ELEMENT,
  UPDATE_CURRENT_LIST,
  REMOVE_ELEMENT_FROM_LIST
} from './list.reducer';
import {OPEN_MODAL} from './modal.reducer';
import {SEARCH_QUERY} from './search.reducer';
import {saveProfiles, getProfiles} from '../utils/profile';
import {saveLists, loadLists} from '../utils/requestLists';

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
    case ON_BELT_REQUEST: {
      const state = store.getState();
      const b = state.beltsReducer.belts.find(
        belt => belt.name === action.beltName
      );
      fetchBeltWorks(b, state.filterReducer, store.dispatch);
      return next(action);
    }
    case ON_WORK_REQUEST: {
      fetchWork(action.pid, store.dispatch);
      return next(action);
    }
    case ON_USER_DETAILS_REQUEST:
      fetchUser(store.dispatch, () => {
        store.dispatch({type: SHORTLIST_LOAD_REQUEST});
        store.dispatch({type: LIST_LOAD_REQUEST});
      });
      return next(action);
    case ON_LOGOUT_REQUEST:
      logout(store.dispatch);
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
      const {isLoggedIn} = store.getState().profileReducer.user;
      saveShortList(elements, isLoggedIn);
      return res;
    }
    case SHORTLIST_LOAD_REQUEST: {
      const res = next(action);
      const {isLoggedIn} = store.getState().profileReducer.user;
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

export const profileMiddleware = store => next => action => {
  switch (action.type) {
    case ON_ADD_PROFILE_ELEMENT:
    case ON_REMOVE_PROFILE_ELEMENT:
    case ON_PROFILE_REMOVE_CURRENT_PROFILE:
    case ON_PROFILE_CREATE_TASTE:
    case ON_ADD_PROFILE_ARCHETYPE: {
      const res = next(action);
      const {
        profiles,
        currentTaste
      } = store.getState().profileReducer.profileTastes;
      saveProfiles(profiles, currentTaste);
      fetchProfileRecommendations(profiles[currentTaste], store.dispatch);
      return res;
    }
    case ON_PROFILE_LOAD_PROFILES:
      getProfiles(profileTastes => {
        store.dispatch({
          type: ON_PROFILE_LOAD_PROFILES_RESPONSE,
          profileTastes
        });
      });
      return next(action);
    default:
      return next(action);
  }
};

export const listMiddleware = store => next => async action => {
  switch (action.type) {
    case LIST_TOGGLE_ELEMENT:
    case ADD_ELEMENT_TO_LIST:
    case REMOVE_ELEMENT_FROM_LIST:
    case UPDATE_CURRENT_LIST:
    case ADD_LIST:
    case REMOVE_LIST: {
      const res = next(action);
      const {lists} = store.getState().listReducer;
      const {isLoggedIn} = store.getState().profileReducer.user;
      await saveLists(lists, isLoggedIn);
      return res;
    }
    case LIST_LOAD_REQUEST: {
      const res = next(action);
      const {isLoggedIn} = store.getState().profileReducer.user;
      const lists = await loadLists(isLoggedIn);
      let currentList;
      if (action.id) {
        currentList = lists.filter(list => list.id === action.id)[0];
      }
      store.dispatch({
        type: LIST_LOAD_RESPONSE,
        lists,
        currentList
      });
      return res;
    }
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
