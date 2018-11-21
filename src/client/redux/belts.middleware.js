import {
  BELTS_LOAD_REQUEST,
  BELTS_LOAD_RESPONSE,
  UPDATE_BELT,
  REMOVE_BELT_REQUEST,
  REMOVE_BELT_RESPONSE
} from './belts.reducer';
import {fetchObjects, addObject, deleteObject} from '../utils/requester';

export const beltsMiddleware = store => next => async action => {
  switch (action.type) {
    case UPDATE_BELT: {
      const openplatformId = store.getState().userReducer.openplatformId;

      console.log('openplatformid', openplatformId);

      console.log('UPDATE_BELT in middleware', action.belt);

      const response = await addObject({
        ...action.belt,
        _owner: openplatformId
      });

      console.log('response in middleware', response);

      const belt = {
        ...action.belt,
        ...response.data
      };

      console.log('belt in UPDATE_BELT in middleware', belt);

      return next({type: action.type, belt});
    }

    // case REMOVE_BELT_REQUEST: {
    //   const _id = action.belt._id;
    //
    //   console.log('REMOVE_BELT_REQUEST in middleware, ', action, _id);
    //
    //   deleteObject({_id});
    //   return next(action);
    // }

    case REMOVE_BELT_REQUEST: {
      const _id = action.belt._id;
      return (async () => {
        next(action);

        console.log('REMOVE_BELT_REQUEST in middleware, ', action, _id);

        deleteObject({_id});

        store.dispatch({
          type: REMOVE_BELT_RESPONSE
        });
      })();
    }

    case BELTS_LOAD_REQUEST: {
      const openplatformId = store.getState().userReducer.openplatformId;
      return (async () => {
        next(action);

        const belts = (await fetchObjects(null, 'belt', openplatformId)).data;

        console.log('BELTS LOAD in middleware', belts);

        store.dispatch({
          type: BELTS_LOAD_RESPONSE,
          data: belts
        });
      })();
    }
    default:
      return next(action);
  }
};
