import {
  BELTS_LOAD_REQUEST,
  BELTS_LOAD_RESPONSE,
  STORE_BELT,
  UPDATE_BELT,
  REMOVE_BELT_REQUEST,
  REMOVE_BELT_RESPONSE
} from './belts.reducer';
import {
  fetchObjects,
  addObject,
  updateObject,
  deleteObject
} from '../utils/requester';

export const beltsMiddleware = store => next => async action => {
  switch (action.type) {
    case STORE_BELT: {
      const openplatformId = store.getState().userReducer.openplatformId;

      const response = await addObject({
        ...action.belt,
        _owner: openplatformId
      });

      const belt = {
        ...action.belt,
        ...response.data,
        _owner: openplatformId
      };

      return next({type: action.type, belt});
    }

    case UPDATE_BELT: {
      const openplatformId = store.getState().userReducer.openplatformId;

      const response = await updateObject({
        ...action.belt,
        editing: false,
        _owner: openplatformId
      });

      const belt = {
        ...action.belt,
        ...response.data
      };

      return next({type: action.type, belt});
    }

    case REMOVE_BELT_REQUEST: {
      const _id = action.belt._id;
      return (async () => {
        next(action);

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
