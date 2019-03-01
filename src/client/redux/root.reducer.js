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
import booksReducer from './books.reducer';
import recommendReducer from './recommend';
import {replayReducer} from './replay';
import interactionReducer from './interaction.reducer';
import spotsReducer from './spots.reducer';
import filtercardReducer from './filtercard.reducer';
import heroReducer from './hero.reducer';
import articleReducer from './article.reducer';
import stats from './stats.reducer';
import scrollToComponent from './scrollToComponent';
import matomo from './matomo.reducer';
import animateReducer from './animate.reducer';

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
  tasteReducer,
  booksReducer,
  recommendReducer,
  replay: replayReducer,
  interactionReducer,
  spotsReducer,
  filtercardReducer,
  heroReducer,
  articleReducer,
  stats,
  scrollToComponent,
  matomo,
  animateReducer
});

const rootReducer = (state = {}, action) => {
  const newState = combined(state, action);
  // setLocalStorage(newState);
  return newState;
};

export default rootReducer;
