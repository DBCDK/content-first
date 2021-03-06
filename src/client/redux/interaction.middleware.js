import {ON_SHORTLIST_TOGGLE_ELEMENT} from './shortlist.reducer';
import {ON_LOCATION_CHANGE} from './router.reducer';
import {UPDATE_MOUNT} from './mounts.reducer';
import {LIST_TOGGLE_ELEMENT} from './list.reducer';
import {ORDER} from './order.reducer';
import request from 'superagent';
import {fetchObjects} from '../utils/requester';
import {
  INTERACTION,
  FETCH_INTERACTIONS,
  FETCH_INTERACTIONS_ERROR,
  FETCH_INTERACTIONS_SUCCESS
} from './interaction.reducer';
import {get} from 'lodash';

let isNotChecked = (list, pid) => {
  return !list.find(element => element.pid === pid);
};

export const interactionMiddleware = store => next => action => {
  switch (action.type) {
    case INTERACTION: {
      try {
        if (get(store.getState(), 'userReducer.isLoggedIn')) {
          request
            .post('/v1/object/')
            .send({
              _type: INTERACTION,
              interaction: action.interaction,
              pid: action.pid
            })
            .end();
        }
      } catch (e) {
        request
          .post('/v1/log')
          .send({type: action.type, error: 'CLIENT_LOG_ERROR', msg: String(e)})
          .end();
      }
      return next(action);
    }

    case FETCH_INTERACTIONS:
      return (async () => {
        next(action);
        try {
          const openplatformId = store.getState().userReducer.openplatformId;
          const dbInteractionData = (
            await fetchObjects('', 'INTERACTION', openplatformId, 20)
          ).data;
          let interactions = [];
          dbInteractionData.forEach(
            (interactionObj, key) =>
              (interactions[key] = {
                type: 'INTERACTION',
                interaction: interactionObj.interaction,
                pid: interactionObj.pid
              })
          );
          interactions.reverse();
          store.dispatch({
            type: FETCH_INTERACTIONS_SUCCESS,
            id: action.id,
            interactions
          });
        } catch (e) {
          store.dispatch({
            type: FETCH_INTERACTIONS_ERROR,
            id: action.id
          });
        }
      })();

    case ON_LOCATION_CHANGE: {
      let pidPath = action.path;
      let pid = pidPath;

      if (pidPath.startsWith('/værk/')) {
        pid = pidPath.slice(6, pidPath.length);
      }
      if (!pid.startsWith('/')) {
        store.dispatch({
          type: INTERACTION,
          pid: pid,
          interaction: 'NEW_LOCATION'
        });
      }
      return next(action);
    }

    case ON_SHORTLIST_TOGGLE_ELEMENT: {
      // HUSK button is clicked
      const notChecked = isNotChecked(
        store.getState().shortListReducer.elements,
        action.element.book.pid
      );
      if (notChecked) {
        store.dispatch({
          type: INTERACTION,
          pid: action.element.book.pid,
          interaction: 'SHORTLIST'
        });
      }
      return next(action);
    }

    case ORDER: {
      store.dispatch({
        type: INTERACTION,
        pid: action.book.pid,
        interaction: 'ORDER'
      });
      return next(action);
    }

    case LIST_TOGGLE_ELEMENT: {
      const notChecked = isNotChecked(
        store.getState().listReducer.lists[action._id].list,
        action.element.book.pid
      );
      if (notChecked) {
        store.dispatch({
          type: INTERACTION,
          pid: action.element.book.pid,
          interaction: 'LIST_TOGGLE_ELEMENT'
        });
      }
      return next(action);
    }

    case UPDATE_MOUNT: {
      const type = get(action, 'data.type');
      const pid = get(action, 'data.parent', 'unknown');
      if (type === 'PREVIEW') {
        store.dispatch({
          type: INTERACTION,
          pid,
          interaction: 'PREVIEW'
        });
      }
      return next(action);
    }

    default:
      return next(action);
  }
};
