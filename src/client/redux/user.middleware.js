import {fetchUser, logout, addImage, saveUser} from '../utils/requester';
import {
  ON_USER_DETAILS_REQUEST,
  ON_LOGOUT_REQUEST,
  ADD_PROFILE_IMAGE,
  ADD_PROFILE_IMAGE_SUCCESS,
  ADD_PROFILE_IMAGE_ERROR,
  SAVE_USER_PROFILE,
  ON_USER_DETAILS_RESPONSE,
  SAVE_USER_PROFILE_ERROR,
  ADD_USER_AGENCY,
  SAVE_USER_PROFILE_SUCCESS
} from './user.reducer';
import {RECEIVE_USER} from './users';
import {SHORTLIST_LOAD_REQUEST} from './shortlist.reducer';
import {LIST_LOAD_REQUEST} from './list.reducer';
import openplatform from 'openplatform';
import {HISTORY_PUSH} from './router.reducer';
import {FETCH_INTERACTIONS} from "./interaction.reducer";

async function openplatformLogin(state) {
  if (!openplatform.connected()) {
    const token = state.userReducer.openplatformToken;
    if (!token) {
      throw new Error('missing openplatformToken');
    }
    await openplatform.connect(token);
  }
}

export const userMiddleware = store => next => action => {
  switch (action.type) {
    case ON_USER_DETAILS_REQUEST:
      fetchUser(store.dispatch, () => {
        store.dispatch({type: SHORTLIST_LOAD_REQUEST});
        store.dispatch({type: LIST_LOAD_REQUEST});
        store.dispatch({type: FETCH_INTERACTIONS})
      });
      return next(action);
    case ON_USER_DETAILS_RESPONSE:
      next(action);
      store.dispatch({
        type: RECEIVE_USER,
        id: action.user.openplatformId,
        user: action.user
      });

      return (async () => {
        try {
          if (!action.user) {
            return;
          }
          await openplatformLogin(store.getState());
          const user = await openplatform.user();
          const libs = await openplatform.libraries({
            agencyIds: [user.agency],
            fields: ['agencyName']
          });
          store.dispatch({
            type: ADD_USER_AGENCY,
            agencyName: libs[0].agencyName
          });
        } catch (e) {
          store.dispatch({
            type: ADD_USER_AGENCY,
            agencyName: ''
          });
        }
      })();
    case SAVE_USER_PROFILE:
      next(action);
      store.dispatch({
        type: RECEIVE_USER,
        id: action.user.openplatformId,
        user: action.user
      });

      return (async () => {
        try {
          const user = await saveUser(action.user);
          store.dispatch({type: SAVE_USER_PROFILE_SUCCESS, user});
          store.dispatch({type: HISTORY_PUSH, path: '/'});
        } catch (error) {
          store.dispatch({type: SAVE_USER_PROFILE_ERROR, error});
        }
      })();
    case ON_LOGOUT_REQUEST:
      logout(store.dispatch);
      return next(action);
    case ADD_PROFILE_IMAGE:
      next(action);
      return (async () => {
        try {
          const image = await addImage(action.image);
          store.dispatch({type: ADD_PROFILE_IMAGE_SUCCESS, image});
        } catch (error) {
          store.dispatch({type: ADD_PROFILE_IMAGE_ERROR, error});
        }
      })();
    default:
      return next(action);
  }
};
