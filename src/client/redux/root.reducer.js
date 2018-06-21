import {combineReducers} from 'redux';
import beltsReducer from './belts.reducer';
import filterReducer from './filter.reducer';
import routerReducer from './router.reducer';
import userReducer from './user.reducer';
import {usersReducer} from './users';
import tasteReducer from './taste.reducer';
import listReducer from './list.reducer';
import followReducer from './follow.reducer';
import shortListReducer from './shortlist.reducer';
import modalReducer from './modal.reducer';
import searchReducer from './search.reducer';
import orderReducer from './order.reducer';
import commentReducer from './comment.reducer';
import bookcaseReducer from './bookcase.reducer';
import booksReducer from './books.reducer';
import recommendReducer from './recommend';
import tagIdReducer from './tagId';
import {replayReducer} from './replay';
import interactionReducer from './interaction.reducer';

const combined = combineReducers({
  beltsReducer,
  filterReducer,
  listReducer,
  followReducer,
  userReducer: userReducer,
  users: usersReducer,
  routerReducer,
  shortListReducer,
  modalReducer,
  searchReducer,
  orderReducer,
  comments: commentReducer,
  bookcaseReducer,
  tasteReducer,
  booksReducer,
  recommendReducer,
  tagIdReducer,
  replay: replayReducer,
  interactionReducer
});

const rootReducer = (state = {}, action) => {
  const newState = combined(state, action);
  // setLocalStorage(newState);
  return newState;
};

export default rootReducer;
