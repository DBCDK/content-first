/* eslint-disable complexity */
import {trackEvent, trackDataEvent, setUserStatus} from '../matomo';
import {setItem, getItem} from '../utils/localstorage';
import {get} from 'lodash';
import {UPDATE_MOUNT} from './mounts.reducer';
import {ON_LOCATION_CHANGE} from './router.reducer';
import {MATOMO_RID} from './matomo.reducer';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from './shortlist.reducer';
import {
  LIST_TOGGLE_ELEMENT,
  ADD_ELEMENT_TO_LIST,
  STORE_LIST
} from './list.reducer';
import {ORDER_SUCCESS} from './order.reducer';
import {HISTORY_NEW_TAB} from './middleware';
import {ORDER} from './order.reducer';
import {
  ON_USER_DETAILS_RESPONSE,
  ON_USER_DETAILS_ERROR,
  SAVE_USER_PROFILE_SUCCESS
} from './user.reducer';
import {OPEN_MODAL} from './modal.reducer';

export const matomoMiddleware = store => next => action => {
  switch (action.type) {
    case UPDATE_MOUNT: {
      const type = get(action, 'data.type');
      const pid = get(action, 'data.parent', 'unknown');
      let parentBeltName = get(action, 'data.beltName', 'unknown');

      if (action.mount === 'frontpage-interactions-belt') {
        parentBeltName = 'personalRecommendations';
      } else if (get(action, 'ctx.name')) {
        parentBeltName = get(action, 'ctx.name');
      } else if (get(action, 'data.beltName.minderLink[1]')) {
        parentBeltName = `Minder om ${get(
          action,
          'data.beltName.minderLink[1]'
        )}`;
      } else if (get(action, 'data.beltName', 'unknown')) {
        parentBeltName = get(action, 'data.beltName');
      } else {
        parentBeltName = 'unknown';
      }

      const rid = get(action, 'data.rid');
      const scrollPos = get(action, 'data.scrollPos');
      const titleClick = get(action, 'data.titleClick');
      const tagClick = get(action, 'data.tagClick');
      const beltName = get(action, 'data.beltName', 'unknownBeltName');

      if (type === 'PREVIEW') {
        const category = `belt:${parentBeltName}`;
        const a = 'beltExpandWork';
        const name = `pid:${pid}`;
        trackEvent(category, a, name);
        trackDataEvent('preview', {
          pid,
          rid: rid
        });
      } else if (type === 'SIMILAR') {
        const category = `belt:${parentBeltName}`;
        const a = 'beltMoreLikeThis';
        const name = `pid:${pid}`;
        trackEvent(category, a, name);
      } else if (scrollPos) {
        let category = `belt:${parentBeltName}`;
        const a = 'beltSwipe';
        const name = 'position';
        const val = scrollPos;
        trackEvent(category, a, name, val);
      } else if (titleClick) {
        const category = `belt:${parentBeltName}`;
        const a = 'beltTitleClick';
        trackEvent(category, a);
      } else if (tagClick) {
        const category = `belt:${parentBeltName}`;
        const a = 'beltTagClick';
        const name = `tag:${tagClick}`;
        trackEvent(category, a, name);
      }
      store.dispatch({type: MATOMO_RID, key: pid, rid: rid});
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

    case ORDER: {
      const book = action.book;
      const category = `orderModal:${book.pid}`;
      const a = 'orderModalOpen';
      const name = `pid:${book.pid}`;
      trackEvent(category, a, name);
      return next(action);
    }

    case ON_USER_DETAILS_RESPONSE: {
      if (!getItem('didSetUserAuthenticated', 1, false)) {
        trackEvent('user', 'setUserStatus', 'AUTHENTICATED');
        setItem('didSetUserAuthenticated', true, 1);
        setItem('didSetUserAnonymous', false, 1);
      }
      setUserStatus(true);
      return next(action);
    }

    case ON_USER_DETAILS_ERROR: {
      if (!getItem('didSetUserAnonymous', 1, false)) {
        trackEvent('user', 'setUserStatus', 'ANONYMOUS');
        setItem('didSetUserAnonymous', true, 1);
        setItem('didSetUserAuthenticated', false, 1);
      }
      setUserStatus(false);
      return next(action);
    }

    case SAVE_USER_PROFILE_SUCCESS: {
      if (action.user.acceptedTerms) {
        trackEvent('user', 'createUserProfile', action.user.openplatformId);
      }
      return next(action);
    }

    case STORE_LIST: {
      if (action.createList) {
        trackEvent(
          'list',
          'createList',
          store.getState().listReducer.lists[action._id].title
        );
      }
      return next(action);
    }

    case OPEN_MODAL: {
      if (action.modal === 'list' && action.createListAttempt) {
        trackEvent('list', 'createListAttempt', 0);
      }
      return next(action);
    }

    default:
      return next(action);
  }
};
