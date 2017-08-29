import {combineReducers} from 'redux';
import worksReducer from './works';

const LOCAL_STORAGE_KEY = 'recommenderfeedback';

const getLocalStorage = () => {
  const storageString = sessionStorage.getItem(LOCAL_STORAGE_KEY);
  return (storageString && JSON.parse(storageString)) || {};
};

const setLocalStorage = (state) => {
  sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

const combined = combineReducers({
  worksReducer
});

const rootReducer = (state = getLocalStorage(), action) => {
  console.log('Processing action', action);
  const newState = combined(state, action);
  setLocalStorage(newState);
  return newState;
};

export default rootReducer;
