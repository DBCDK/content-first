import {fetchObjects, addObject} from '../utils/requester';
import {
  ADD_COMMENT,
  ADD_COMMENT_SUCCESS,
  FETCH_COMMENTS,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_ERROR,
  ADD_COMMENT_ERROR
} from './comment.reducer';

export const commentMiddleware = store => next => action => {
  switch (action.type) {
    case ADD_COMMENT: {
      return (async () => {
        next(action);
        try {
          const owner = store.getState().userReducer.openplatformId;
          const response = await addObject({
            _key: action.id,
            _type: 'comment',
            _public: true,
            comment: action.comment
          });
          store.dispatch({
            type: ADD_COMMENT_SUCCESS,
            id: action.id,
            comment: {
              comment: action.comment,
              _id: response.data.id,
              _rev: response.data.rev,
              _owner: owner
            }
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
