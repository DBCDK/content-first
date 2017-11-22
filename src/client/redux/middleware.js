import {ON_BELT_REQUEST} from './belts.reducer';
import {ON_WORK_REQUEST} from './work.reducer';
import {fetchBeltWorks, fetchWork, fetchUser, fetchProfileRecommendations, logout} from '../utils/requester';
import {ON_PROFILE_RECOMMENDATIONS_REQUEST, ON_USER_DETAILS_REQUEST, ON_LOGOUT_REQUEST} from './profile.reducer';

export const HISTORY_PUSH = 'HISTORY_PUSH';
export const HISTORY_PUSH_FORCE_REFRESH = 'HISTORY_PUSH_FORCE_REFRESH';
export const HISTORY_REPLACE = 'HISTORY_REPLACE';

const paramsToString = (params) => {
  let res = '';
  Object.keys(params).forEach(key => {
    if (Array.isArray(params[key])) {
      params[key].forEach(value => {
        const separator = res === '' ? '?' : '&';
        res += `${separator}${key}=${value}`;
      });
    }
    else {
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
    case ON_PROFILE_RECOMMENDATIONS_REQUEST: {
      const {profileReducer} = store.getState();
      fetchProfileRecommendations(profileReducer, store.dispatch);
      return next(action);
    }
    case ON_USER_DETAILS_REQUEST:
      fetchUser(store.dispatch);
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
    console.log('Next state', {type: action.type, action, nextState: store.getState()});
    return res;
  }
  catch (error) {
    console.log('Action failed', {action, error});
  }
};
/* eslint-enable no-console */
