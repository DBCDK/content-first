import {combineReducers} from 'redux';
import beltsReducer from './belts';
import generalReducer from './general';

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
  generalReducer
});

const rootReducer = (state = getLocalStorage(), action) => {
  console.log('Processing action', action);
  const newState = combined(state, action);
  setLocalStorage(newState);
  console.log(newState);
  return newState;
};

export default rootReducer;
