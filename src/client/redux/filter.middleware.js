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
      const isTitelorCreator =
        (filterId.parents && filterId.parents[1] === 'Forfatter') ||
        (filterId.parents && filterId.parents[1] === 'Bog');
      const isTag = !isTitelorCreator;
      const fullRange = getFullRange(filterId, filterCards, filtersMapAll);
      const params = {};
      let tags = [...selectedTagIdss];
      if (fullRange) {
        // The tag is part of a range
        const location = findRangeLocation(
          filterId,
          selectedTagIdss,
          fullRange
        );
        const prevSelectedRange = tags[location];
        const newSelectedRange = getSelectedRange(
          filterId,
          prevSelectedRange,
          fullRange
        );

        // We need to add, remove or replace the tag range
        if (location === -1) {
          tags.push(newSelectedRange);
        } else if (
          isFullRange(newSelectedRange, fullRange) ||
          (isEqual(prevSelectedRange, newSelectedRange) && isRange(filterId))
        ) {
          tags.splice(location, 1);
        } else {
          tags[location] = newSelectedRange;
        }
        newQueryType = 'tags';
        params.tags = tagsToUrlParams(tags);
      } else if (isTag) {
        const location = tags.indexOf(filterId);
        if (location === -1) {
          tags.push(filterId);
        } else {
          tags.splice(location, 1);
        }
        newQueryType = 'tags';
        params.tags = tagsToUrlParams(tags);
      } else if (isTitelorCreator) {
        /* If selected tag is a Creator or Book Title */
        if (mergedSelectedTags.includes(filterId.text)) {
          /* if creator/title already exist - remove*/
          tags = [];
          store.dispatch({type: 'SEARCH_QUERY', query: ''});
        } else {
          /* if creator/title dont exist - add it*/
          tags = [encodeURIComponent(filterId.text)];
          store.dispatch({
            type: 'SEARCH_QUERY',
            query: filterId.text.toLowerCase()
          });
          newQueryType = 'titlecreator';
        }
        /* if no type is set its a remove tag action and the type value is not important */
        if (!filterId.type) {
          filterId.type = 'creator'; // or Title
        }
        /* add as title or creator key */
        params[filterId.type] = tags;
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
