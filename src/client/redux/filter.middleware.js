import React from 'react';
import {HISTORY_REPLACE} from './router.reducer';
import {TOGGLE_FILTER} from './filter.reducer';
import {isEqual} from 'lodash';
import {toast} from 'react-toastify';
import ToastMessage from '../components/base/ToastMessage';
import {filtersMapAll} from './filter.reducer';
import {
  getQueryType,
  getFullRange,
  findRangeLocation,
  getSelectedRange,
  isFullRange,
  isRange,
  tagsToUrlParams
} from '../utils/taxonomy';
import {
  getTagsFromUrl,
  getCreatorsFromUrl,
  getTitlesFromUrl
} from './selectors';

const triggerCancelToast = onClick => {
  toast(
    <ToastMessage
      type="info"
      icon="history"
      lines={['Du startede en ny søgning', <a onClick={onClick}>Tilbage</a>]}
    />,
    {hideProgressBar: false, pauseOnHover: true}
  );
};

export const filterMiddleware = store => next => async action => {
  switch (action.type) {
    case TOGGLE_FILTER: {
      const state = store.getState();

      const historyPath = state.routerReducer.path;
      const historyParams = state.routerReducer.params;
      const filterCards = state.filtercardReducer;
      let selectedTagIdss = getTagsFromUrl(state);
      const selectedCreators = getCreatorsFromUrl(state);
      const selectedTitles = getTitlesFromUrl(state);
      let mergedSelectedTags = [].concat(
        selectedTagIdss,
        selectedCreators,
        selectedTitles
      );
      let filterId = action.id;
      const prevQueryType = getQueryType(
        selectedTagIdss,
        selectedCreators,
        selectedTitles
      );
      let newQueryType;
      console.log(filterId);
      const isTag = !!filterId.id;

      const params = {};
      let tags = [...selectedTagIdss];
      if (isTag) {
        const fullRange = getFullRange(filterId.id, filterCards, filtersMapAll);
        if (fullRange) {
          // The tag is part of a range
          const location = findRangeLocation(
            filterId.id,
            selectedTagIdss,
            fullRange
          );
          const prevSelectedRange = tags[location];
          const newSelectedRange = getSelectedRange(
            filterId.id,
            prevSelectedRange,
            fullRange
          );

          // We need to add, remove or replace the tag range
          if (location === -1) {
            tags.push(newSelectedRange);
          } else if (
            isFullRange(newSelectedRange, fullRange) ||
            (isEqual(prevSelectedRange, newSelectedRange) &&
              isRange(filterId.id))
          ) {
            tags.splice(location, 1);
          } else {
            tags[location] = newSelectedRange;
          }
          newQueryType = 'tags';
          params.tags = tagsToUrlParams(tags);
        } else {
          const location = tags.indexOf(filterId.id);
          if (location === -1) {
            tags.push(filterId.id);
          } else {
            tags.splice(location, 1);
          }
          newQueryType = 'tags';
          params.tags = tagsToUrlParams(tags);
        }
      } else if (filterId.type === 'TITLE') {
        params['pid'] = filterId.pid;
      } else if (filterId.type === 'AUTHOR') {
        // TODO handle author
        params['author'] = filterId.authorName;
      }

      if (prevQueryType && prevQueryType !== newQueryType) {
        triggerCancelToast(() => {
          store.dispatch({
            type: HISTORY_REPLACE,
            path: historyPath,
            params: historyParams
          });
        });
      }

      store.dispatch({
        type: HISTORY_REPLACE,
        path: '/find',
        params
      });

      return next(action);
    }
    default:
      return next(action);
  }
};
