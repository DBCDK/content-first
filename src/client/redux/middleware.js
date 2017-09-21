import {ON_BELT_REQUEST} from './belts.reducer';
import {ON_WORK_REQUEST} from './work.reducer';
import {fetchBeltWorks, fetchWork} from '../utils/requester';

export const HISTORY_PUSH = 'HISTORY_PUSH';

export const historyMiddleware = history => store => next => action => {
  switch (action.type) {
    case HISTORY_PUSH:
      if (store.getState().routerReducer.path !== action.path) {
        history.push(action.path);
        window.scrollTo(0, 0);
      }
      break;
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
