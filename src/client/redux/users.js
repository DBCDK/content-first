/* eslint no-undefined:0 */
import Immutable from 'immutable';
import request from 'superagent';
import {createSelector} from 'reselect';

const defaultState = Immutable.fromJS({});

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

//
// Reducer
//
export function usersReducer(state = defaultState, action) {
  switch (action.type) {
    case REQUEST_USER:
      return state.get(action.id, false)
        ? state
        : state.setIn([action.id, 'loading'], true);

    case RECEIVE_USER:
      return state.set(action.id, Immutable.fromJS(action.user));

    default:
      return state;
  }
}

//
// Middleware
//
export const usersMiddleware = store => next => action => {
  switch (action.type) {
    case REQUEST_USER:
      if (!store.getState().users.get(action.id, false)) {
        (async () => {
          try {
            const response = await request.get(
              `/v1/user/${encodeURIComponent(action.id)}`
            );
            store.dispatch({
              type: RECEIVE_USER,
              id: action.id,
              user: response.body.data
            });
          } catch (e) {
            store.dispatch({
              type: 'LOG_ERROR',
              userId: action.id,
              error: String(e),
              msg: 'Error when fetching user'
            });

            // Clear user in state, such that we try to fetch it again, if we try again
            store.dispatch({
              type: RECEIVE_USER,
              id: action.id,
              user: undefined
            });
          }
        })();
      }
      return next(action);
    default:
      return next(action);
  }
};

// -------------SELECTORS-----------------
export const createGetUserSelector = () =>
  createSelector(
    [state => state.users, (state, {id}) => id],
    (users, id) => {
      const user = users.get(id);
      if (user) {
        return user.toJS();
      }
      return null;
    }
  );
export const getUser = createGetUserSelector();
export const createGetUsersSelector = () =>
  createSelector(
    state => state.users,
    users => {
      return users.toJS();
    }
  );
