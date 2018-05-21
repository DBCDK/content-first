import {ON_SHORTLIST_TOGGLE_ELEMENT} from './shortlist.reducer';
import {LIST_TOGGLE_ELEMENT} from './list.reducer';
import {ORDER} from './order.reducer';
import {INTERACTION} from './interaction.reducer';
import {ON_LOCATION_CHANGE} from './router.reducer';
import request from 'superagent';
import {fetchObjects} from '../utils/requester';
import {
  FETCH_INTERACTIONS,
  FETCH_INTERACTIONS_ERROR,
  FETCH_INTERACTIONS_SUCCESS
} from './interaction.reducer';
const LOG_INTERACTION = 'LOG_INTERACTION';

export const interactionMiddleware = store => next => action => {
  switch (action.type) {
    case ON_LOCATION_CHANGE: {
      let pidPath = action.path;
      let pid = pidPath.slice(6, pidPath.length);

      store.dispatch({
        type: INTERACTION,
        pid: pid,
        interaction: 'on_location_change'
      });
      store.dispatch({
        type: LOG_INTERACTION,
        pid: pid,
        interaction: 'on_location_change'
      });
      return next(action);
    }
    case ON_SHORTLIST_TOGGLE_ELEMENT: {
      store.dispatch({
        type: INTERACTION,
        pid: action.element.book.pid,
        interaction: 'on_shortlist_toggle'
      });
      store.dispatch({
        type: LOG_INTERACTION,
        pid: action.element.book.pid,
        interaction: 'on_shortlist_toggle'
      });
      return next(action);
    }
    case ORDER: {
      store.dispatch({
        type: INTERACTION,
        pid: action.book.pid,
        interaction: 'order'
      });
      store.dispatch({
        type: LOG_INTERACTION,
        pid: action.book.pid,
        interaction: 'order'
      });
      return next(action);
    }
    case LIST_TOGGLE_ELEMENT: {
      store.dispatch({
        type: INTERACTION,
        pid: action.element.book.pid,
        interaction: 'list_toggle_element'
      });
      store.dispatch({
        type: LOG_INTERACTION,
        pid: action.element.book.pid,
        interaction: 'list_toggle_element'
      });
      return next(action);
    }

    default:
      return next(action);
  }
};

export const logInteractionsMiddleware = store => next => action => {
  switch (action.type) {
    case LOG_INTERACTION: {
      try {
        request
          .post('/v1/object/')
          .send({
            _type: 'INTERACTION',
            interaction: action.interaction,
            pid: action.pid,
            _public: true
          })
          .end();
      } catch (e) {
        request
          .post('/v1/object/')
          .send({
            _type: 'INTERACTION',
            error: 'CLIENT_LOG_ERROR',
            content: String(e)
          })
          .end();
      }
      break;
    }

    case FETCH_INTERACTIONS:
      return (async () => {
        next(action);
        try {
          const dbInteractionData = (await fetchObjects('', 'INTERACTION', 20))
            .data;
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
    default:
      return next(action);
  }
};
