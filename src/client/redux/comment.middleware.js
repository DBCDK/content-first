import {fetchObjects, addObject} from '../utils/requester';
import {
  ADD_COMMENT,
  FETCH_COMMENTS,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_ERROR
} from './comment.reducer';

export const commentMiddleware = store => next => action => {
  switch (action.type) {
    case ADD_COMMENT: {
      return (async () => {
        next(action);
        try {
          const response = await addObject({
            key: action.id,
            type: 'comment',
            comment: action.comment
          });
          /*store.dispatch({
            type: FETCH_COMMENTS_SUCCESS,
            id: action.id,
            comments
          });*/
        } catch (e) {
          /*store.dispatch({
            type: FETCH_COMMENTS_ERROR,
            id: action.id
          });*/
          console.log(e);
        }
      })();
    }
    case FETCH_COMMENTS:
      return (async () => {
        next(action);
        try {
          const comments = (await fetchObjects(action.id, 'comment')).data;
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
