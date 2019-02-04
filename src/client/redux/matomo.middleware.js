/* eslint-disable complexity */
import {trackEvent, trackDataEvent} from '../matomo';
import {get} from 'lodash';
import {
  ADD_CHILD_BELT,
  ADD_BELT,
  BELT_SCROLL,
  BELT_TITLE_CLICK,
  BELT_TAG_CLICK
} from './belts.reducer';
import {ON_LOCATION_CHANGE} from './router.reducer';
import {MATOMO_RID} from './matomo.reducer';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from './shortlist.reducer';
import {LIST_TOGGLE_ELEMENT, ADD_ELEMENT_TO_LIST} from './list.reducer';
import {ORDER_SUCCESS} from './order.reducer';
import {HISTORY_NEW_TAB} from './middleware';

export const matomoMiddleware = store => next => action => {
  switch (action.type) {
    case ADD_BELT: {
      if (get(action, 'belt.key', '').startsWith('filterpage')) {
        // a "root" belt is added on the /find page
        const category = 'searchResult';
        const a =
          get(action, 'belt.type') === 'preview'
            ? 'beltExpandWork'
            : 'beltMoreLikeThis';
        const name = `pid:${get(action, 'belt.pid', 'unknown')}`;
        trackEvent(category, a, name);

        if (get(action, 'belt.type') === 'preview') {
          const pid = get(action, 'belt.pid', 'unknown');
          trackDataEvent('preview', {
            pid,
            rid: action.rid
          });
          store.dispatch({type: MATOMO_RID, key: pid, rid: action.rid});
        }
      }
      return next(action);
    }
    case ADD_CHILD_BELT: {
      const category =
        get(action, 'parentBelt.type') === 'preview'
          ? `preview:${get(action, 'parentBelt.pid', 'unknown')}`
          : `belt:${get(action, 'parentBelt.name', 'unknown')}`;
      const a =
        get(action, 'childBelt.type') === 'preview'
          ? 'beltExpandWork'
          : 'beltMoreLikeThis';
      const name = `pid:${get(action, 'childBelt.pid', 'unknown')}`;
      const val = action.workPosition;
      trackEvent(category, a, name, val);

      if (get(action, 'childBelt.type') === 'preview') {
        const pid = get(action, 'childBelt.pid', 'unknown');
        trackDataEvent('preview', {
          pid,
          rid: action.rid
        });
        store.dispatch({type: MATOMO_RID, key: pid, rid: action.rid});
      }
      return next(action);
    }
    case BELT_SCROLL: {
      const category = `belt:${get(action, 'belt.name', 'unknown')}`;
      const a = 'beltSwipe';
      const name = 'position';
      const val = action.scrollPos;
      trackEvent(category, a, name, val);
      return next(action);
    }
    case BELT_TITLE_CLICK: {
      const category = `belt:${get(action, 'belt.name', 'unknown')}`;
      const a = 'beltTitleClick';
      trackEvent(category, a);
      return next(action);
    }
    case BELT_TAG_CLICK: {
      const category = `belt:${get(action, 'belt.name', 'unknown')}`;
      const a = 'beltTagClick';
      const name = `tag:${get(action, 'tag.id', 'unknown')}`;
      trackEvent(category, a, name);
      return next(action);
    }
    case ON_LOCATION_CHANGE: {
      const path = action.path;

      if (path.startsWith('/værk/')) {
        const pid = path.slice(6, path.length);
        const rid = store.getState().matomo.rids[pid];
        trackDataEvent('workView', {
          pid,
          rid
        });
      }

      return next(action);
    }
    case ON_SHORTLIST_TOGGLE_ELEMENT: {
      const pid = action.element.book.pid;
      const rid = action.rid || store.getState().matomo.rids[pid];
      trackDataEvent('addToBasket', {
        pid,
        rid
      });
      return next(action);
    }
    case ADD_ELEMENT_TO_LIST:
    case LIST_TOGGLE_ELEMENT: {
      const pid = action.element.pid || action.element.book.pid;
      const rid = action.rid || store.getState().matomo.rids[pid];
      const list = store.getState().listReducer.lists[action._id];
      if (list.type === 'SYSTEM_LIST') {
        if (list.title === 'Har læst') {
          trackDataEvent('hasConsumed', {
            pid,
            rid
          });
        } else {
          trackDataEvent('willConsume', {
            pid,
            rid
          });
        }
      } else {
        trackDataEvent('addToList', {
          pid,
          rid,
          listId: action._id
        });
      }
      return next(action);
    }
    case HISTORY_NEW_TAB: {
      const {materialType, pid} = action.meta;
      const rid = action.rid || store.getState().matomo.rids[pid];
      if (materialType === 'Ebog') {
        trackDataEvent('openEbook', {
          pid,
          rid
        });
      } else if (materialType === 'Lydbog') {
        trackDataEvent('openAudiobook', {
          pid,
          rid
        });
      }
      return next(action);
    }
    case ORDER_SUCCESS: {
      const pid = action.pid;
      const rid = store.getState().matomo.rids[pid];
      trackDataEvent('order', {
        pid,
        rid
      });
      return next(action);
    }

    default:
      return next(action);
  }
};
