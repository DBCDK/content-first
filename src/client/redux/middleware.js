import openplatform from 'openplatform';

import {ON_BELT_REQUEST} from './belts.reducer';
import {ON_WORK_REQUEST} from './work.reducer';
import {fetchBeltWorks, fetchWork, fetchUser, fetchProfileRecommendations, fetchSearchResults, logout, saveShortList, loadShortList} from '../utils/requester';
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
import {ADD_LIST, STORE_LIST, LIST_LOAD_RESPONSE, LIST_LOAD_REQUEST, getListById} from './list.reducer';
import {OPEN_MODAL} from './modal.reducer';
import {SEARCH_QUERY} from './search.reducer';
import {
  ORDER,
  ORDER_START,
  ORDER_SUCCESS,
  ORDER_FAILURE,
  PICKUP_BRANCHES,
  AVAILABILITY
} from './order.reducer';
import {saveProfiles, getProfiles} from '../utils/profile';
import {saveList, loadLists, createListLocation} from '../utils/requestLists';

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
      const b = state.beltsReducer.belts.find(belt => belt.name === action.beltName);
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
      const {localStorageElements, databaseElements} = await loadShortList(isLoggedIn);
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
      const {profiles, currentTaste} = store.getState().profileReducer.profileTastes;
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
    case STORE_LIST: {
      const res = next(action);
      const {isLoggedIn} = store.getState().profileReducer.user;
      const list = getListById(store.getState().listReducer, action.id);
      if (!list) {
        throw new Error(`list with id ${action.id} not found`);
      }
      await saveList(list, isLoggedIn);
      return res;
    }
    case ADD_LIST: {
      if (!action.list.data.id) {
        const {id, location} = await createListLocation();
        action.list.links.self = location;
        action.list.data.id = id;
      }
      return next(action);
    }
    case LIST_LOAD_REQUEST: {
      const res = next(action);
      const {isLoggedIn} = store.getState().profileReducer.user;
      const lists = await loadLists(isLoggedIn);
      store.dispatch({
        type: LIST_LOAD_RESPONSE,
        lists
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

async function openplatformLogin(state) {
  if (!openplatform.connected()) {
    const token = state.profileReducer.user.openplatformToken;
    if (!token) {
      throw new Error('missing openplatformToken');
    }
    await openplatform.connect(token);
  }
}

export const orderMiddleware = store => next => action => {
  switch (action.type) {
    case ORDER: {
      store.dispatch({type: OPEN_MODAL, modal: 'order'});

      const state = store.getState();
<<<<<<< HEAD

      if (state.orderReducer.get('pickupBranches').size === 0) {
        (async () => {
          await openplatformLogin(state);

          let user;
          try {
            user = await openplatform.user();
          } catch (e) {
            // Dummy as we do not have proper logged in users yet
            user = {agency: '710100'};
          }
          const agency = user.agency;

          if (state.orderReducer.get('pickupBranches').size === 0) {
            store.dispatch({
              type: PICKUP_BRANCHES,
              branches: await openplatform.libraries({
                agencyIds: [agency],
                fields: ['branchId', 'branchName']
              })
            });
          }
        })();
      }

      if (
        !state.orderReducer.getIn(
          ['orders', action.book.pid, 'availability'],
          false
        )
      ) {
        (async () => {
          await openplatformLogin(state);
          const availability = await openplatform.availability({
            pid: action.book.pid
          });
          store.dispatch({
            type: AVAILABILITY,
            pid: action.book.pid,
            availability
          });
        })();
=======
      if (['ordering', 'ordered'].includes(_.get(state, ['orderReducer', action.pid, 'state']))) {
        return;
>>>>>>> fix react components to work with refactored list reducer. fixing tests.
      }
      return next(action);
    }
    case ORDER_START: {
      (async () => {
        try {
          await openplatform.order({
            pids: [action.pid],
            library: action.branch
          });

          store.dispatch({
            type: ORDER_SUCCESS,
            pid: action.pid
          });
        } catch (e) {
          // eslint-disable-next-line
          console.log('Error on order:', e);
          store.dispatch({
            type: ORDER_FAILURE,
            pid: action.pid
          });
        }
      })();
      return next(action);
    }
    default:
      return next(action);
  }
};
