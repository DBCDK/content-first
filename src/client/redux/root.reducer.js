import {combineReducers} from 'redux';
import {merge, has, cloneDeep} from 'lodash';
import beltsReducer from './belts.reducer';
import filterReducer from './filter.reducer';
import routerReducer from './router.reducer';
import userReducer from './user.reducer';
import {usersReducer} from './users';
import listReducer from './list.reducer';
import followReducer from './follow.reducer';
import shortListReducer from './shortlist.reducer';
import modalReducer from './modal.reducer';
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
import mountsReducer from './mounts.reducer';
import rolesReducer from './roles.reducer';
import kioskReducer from './kiosk.reducer';
import holdingsReducer from './holdings.reducer';
export const ON_INIT_REDUCER_RESPONSE = 'ON_INIT_REDUCER_RESPONSE';

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
  orderReducer,
  comments: commentReducer,
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
  animateReducer,
  mounts: mountsReducer,
  roles: rolesReducer,
  kiosk: kioskReducer,
  holdings: holdingsReducer
});

const rootReducer = (state = {}, action) => {
  const newState = combined(state, action);
  // setLocalStorage(newState);
  if (action.type === ON_INIT_REDUCER_RESPONSE) {
    // we cloneDeep to prevent all sorts of nasty bugs
    // (components not being rerendered properly).
    // The merge function mutate objects (redux requires an immutable update pattern)
    const res = cloneDeep(merge(newState, action.state));
    if (has(res, 'beltsReducer.belts.skeletonBelt')) {
      delete res.beltsReducer.belts.skeletonBelt;
    }
    return res;
  }
  return newState;
};

export default rootReducer;
