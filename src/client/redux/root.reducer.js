import {combineReducers} from 'redux';
import beltsReducer from './belts.reducer';
import filterReducer from './filter.reducer';
import routerReducer from './router.reducer';
import workReducer from './work.reducer';

// const LOCAL_STORAGE_KEY = 'contentfirst';

// const getLocalStorage = () => {
//   const storageString = sessionStorage.getItem(LOCAL_STORAGE_KEY);
//   return (storageString && JSON.parse(storageString)) || {};
// };
//
// const setLocalStorage = (state) => {
//   sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
// };

const combined = combineReducers({
  beltsReducer,
  filterReducer,
  routerReducer,
  workReducer
});

const rootReducer = (state = {}, action) => {
  const newState = combined(state, action);
  // setLocalStorage(newState);
  return newState;
};

export default rootReducer;
