import {combineReducers} from 'redux';
import beltsReducer from './belts.reducer';
import routerReducer from './router.reducer';

const LOCAL_STORAGE_KEY = 'contentfirst';

const getLocalStorage = () => {
  const storageString = sessionStorage.getItem(LOCAL_STORAGE_KEY);
  return (storageString && JSON.parse(storageString)) || {};
};

const setLocalStorage = (state) => {
  sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

const combined = combineReducers({
  beltsReducer,
  routerReducer
});

const rootReducer = (state = getLocalStorage(), action) => {
  const newState = combined(state, action);
  setLocalStorage(newState);
  return newState;
};

export default rootReducer;
