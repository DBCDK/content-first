import {fetchObjects, addObject, updateObject} from '../utils/requester';
import {
  ADD_COMMENT,
  ADD_COMMENT_SUCCESS,
  SAVE_COMMENT,
  SAVE_COMMENT_SUCCESS,
  FETCH_COMMENTS,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_ERROR,
  ADD_COMMENT_ERROR
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
            data: response.data
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
    case SAVE_COMMENT: {
      return (async () => {
        next(action);
        try {
          const response = await updateObject(comment._id, comment);
          store.dispatch({
            type: SAVE_COMMENT_SUCCESS,
            id: action.id,
            comment: {...action.comment, ...response.data}
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
