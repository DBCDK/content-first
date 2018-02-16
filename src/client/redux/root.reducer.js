import {combineReducers} from 'redux';
import beltsReducer from './belts.reducer';
import filterReducer from './filter.reducer';
import routerReducer from './router.reducer';
import workReducer from './work.reducer';
import userReducer from './user.reducer';
import tasteReducer from './taste.reducer';
import listReducer from './list.reducer';
import shortListReducer from './shortlist.reducer';
import modalReducer from './modal.reducer';
import searchReducer from './search.reducer';
import orderReducer from './order.reducer';

const combined = combineReducers({
  beltsReducer,
  filterReducer,
  listReducer,
  userReducer: userReducer,
  routerReducer,
  workReducer,
  shortListReducer,
  modalReducer,
  searchReducer,
  orderReducer,
  tasteReducer
});

const rootReducer = (state = {}, action) => {
  const newState = combined(state, action);
  // setLocalStorage(newState);
  return newState;
};

export default rootReducer;
