import {trackEvent} from '../matomo';
import {get} from 'lodash';
import {
  ADD_CHILD_BELT,
  ADD_BELT,
  BELT_SCROLL,
  BELT_TITLE_CLICK,
  BELT_TAG_CLICK
} from './belts.reducer';

export const matomoMiddleware = () => next => action => {
  switch (action.type) {
    case ADD_BELT: {
      const category = 'searchResult';
      const a =
        get(action, 'belt.type') === 'preview'
          ? 'beltExpandWork'
          : 'beltMoreLikeThis';
      const name = `pid:${get(action, 'belt.pid', 'unknown')}`;
      trackEvent(category, a, name);
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

    default:
      return next(action);
  }
};
