import {
  FOLLOW,
  UNFOLLOW,
  FOLLOW_LOAD_REQUEST,
  FOLLOW_LOAD_RESPONSE
} from './follow.reducer';
import {fetchObjects, addObject, deleteObject} from '../utils/requester';

export const followMiddleware = store => next => async action => {
  switch (action.type) {
    case FOLLOW: {
      const id = action.id;
      const cat = action.cat;
      const response = await addObject({
        id,
        _type: 'follows',
        cat
      });

      const obj = {
        ...action,
        ...response.data
      };

      return next(obj);
    }

    case UNFOLLOW: {
      const _id = action._id;
      deleteObject({_id});
      return next(action);
    }

    case FOLLOW_LOAD_REQUEST:
      const openplatformId = store.getState().userReducer.openplatformId;
      return (async () => {
        next(action);
        const follows = (await fetchObjects(null, 'follows', openplatformId))
          .data;
        store.dispatch({
          type: FOLLOW_LOAD_RESPONSE,
          data: follows
        });
      })();
    default:
      return next(action);
  }
};
