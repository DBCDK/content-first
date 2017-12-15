import {ON_BELT_REQUEST} from './belts.reducer';
import {ON_WORK_REQUEST} from './work.reducer';
import {
  fetchBeltWorks,
  fetchWork,
  fetchUser,
  fetchProfileRecommendations,
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
  ON_SHORTLIST_REMOVE_ELEMENT,
  ON_SHORTLIST_TOGGLE_ELEMENT,
  SHORTLIST_LOAD_REQUEST,
  SHORTLIST_LOAD_RESPONSE,
  SHORTLIST_APPROVE_MERGE
} from './shortlist.reducer';
import {
  ADD_LIST,
  REMOVE_LIST,
  LIST_LOAD_RESPONSE,
  LIST_LOAD_REQUEST,
  LIST_LOAD_CURRENT_LIST,
  ADD_ELEMENT_TO_LIST,
  UPDATE_CURRENT_LIST,
  REMOVE_ELEMENT_FROM_LIST
} from './list.reducer';
import {saveProfiles, getProfiles} from '../utils/profile';
import {
  saveLists,
  loadCurrentlist,
  loadLists,
  saveCurrentList
} from '../utils/requestLists';

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
      });
      return next(action);
    case ON_LOGOUT_REQUEST:
      logout(store.dispatch);
      return next(action);
    default:
      return next(action);
  }
};

/* eslint-disable no-console */
export const loggerMiddleware = store => next => action => {
  try {
    // console.log('Action dispatched', action);
    const res = next(action);
    console.log('Next state', {
      type: action.type,
      action,
      nextState: store.getState()
    });
    return res;
  } catch (error) {
    console.log('Action failed', {action, error});
  }
};
/* eslint-enable no-console */

export const shortListMiddleware = store => next => async action => {
  switch (action.type) {
    case SHORTLIST_APPROVE_MERGE:
    case ON_LOGOUT_RESPONSE:
    case ON_SHORTLIST_ADD_ELEMENT:
    case ON_SHORTLIST_REMOVE_ELEMENT:
    case ON_SHORTLIST_TOGGLE_ELEMENT: {
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
    case ADD_ELEMENT_TO_LIST:
    case REMOVE_ELEMENT_FROM_LIST:
    case UPDATE_CURRENT_LIST: {
      const res = next(action);
      const {currentList} = store.getState().listReducer;
      saveCurrentList(currentList);
      return res;
    }
    case ADD_LIST:
    case REMOVE_LIST: {
      const res = next(action);
      const {lists, currentList} = store.getState().listReducer;
      const {isLoggedIn} = store.getState().profileReducer.user;
      saveLists(lists, isLoggedIn);
      if (action.clearCurrentlist) {
        saveCurrentList(currentList);
      } else {
        saveCurrentList(null);
      }

      return res;
    }
    case LIST_LOAD_REQUEST: {
      const res = next(action);
      const {isLoggedIn} = store.getState().profileReducer.user;
      if (!action.id) {
        const currentList = loadCurrentlist();
        store.dispatch({
          type: LIST_LOAD_CURRENT_LIST,
          currentList
        });
      }
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
