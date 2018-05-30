import {
  fetchObjects,
  addObject,
  updateObject,
  deleteObject
} from '../utils/requester';
import {
  ADD_COMMENT,
  ADD_COMMENT_SUCCESS,
  UPDATE_COMMENT,
  UPDATE_COMMENT_SUCCESS,
  FETCH_COMMENTS,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_ERROR,
  ADD_COMMENT_ERROR,
  DELETE_COMMENT,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_ERROR,
  UPDATE_COMMENT_ERROR
} from './comment.reducer';

import {REQUEST_USER} from './users';

export const commentMiddleware = store => next => action => {
  switch (action.type) {
    case ADD_COMMENT: {
      return (async () => {
        next(action);
        try {
          const response = await addObject({
            _key: action.id,
            _type: 'comment',
            _public: true,
            comment: action.comment
          });
          store.dispatch({
            type: ADD_COMMENT_SUCCESS,
            id: action.id,
            data: {...response.data, _key: action.id}
          });
        } catch (e) {
          store.dispatch({
            type: ADD_COMMENT_ERROR,
            id: action.id,
            error: e,
            comment: action.comment
          });
        }
      })();
    }
    case UPDATE_COMMENT: {
      // remove properties that we do not wont to save using spread/rest.
      const {user, editing, saving, ...comment} = action.comment; // eslint-disable-line no-unused-vars
      return (async () => {
        next(action);
        try {
          const response = await updateObject(comment);
          store.dispatch({
            type: UPDATE_COMMENT_SUCCESS,
            comment: {...action.comment, ...response.data}
          });
        } catch (e) {
          store.dispatch({
            type: UPDATE_COMMENT_ERROR,
            error: e,
            comment: action.comment
          });
        }
      })();
    }
    case DELETE_COMMENT: {
      return (async () => {
        next(action);
        try {
          await deleteObject(action.comment);
          store.dispatch({
            type: DELETE_COMMENT_SUCCESS,
            comment: action.comment
          });
        } catch (e) {
          store.dispatch({
            type: DELETE_COMMENT_ERROR,
            error: e,
            comment: action.comment
          });
        }
      })();
    }
    case FETCH_COMMENTS:
      return (async () => {
        next(action);
        try {
          const comments = (await fetchObjects(action.id, 'comment')).data;
          comments.forEach(comment =>
            store.dispatch({type: REQUEST_USER, id: comment._owner})
          );
          store.dispatch({
            type: FETCH_COMMENTS_SUCCESS,
            id: action.id,
            comments
          });
        } catch (e) {
          store.dispatch({
            type: FETCH_COMMENTS_ERROR,
            id: action.id
          });
        }
      })();
    default:
      return next(action);
  }
};
