/*
Selectors working on the global state object
*/
import {createSelector} from 'reselect';
import {getBooks} from './books.reducer';
import {getRecommendedPids, applyClientSideFilters} from './recommend';
import {filtersMapAll} from './filter.reducer';
import {getFullRange} from '../utils/taxonomy';

export const getRecommendedBooks = (state, tags, max = 100) => {
  const {recommendReducer, booksReducer} = state;
  const recommendedPids = getRecommendedPids(recommendReducer, {tags});
  const books = getBooks(booksReducer, recommendedPids.pids);

  let booksAreLoading = false;
  books.forEach(b => {
    if (b.isLoading) {
      booksAreLoading = true;
    }
  });

  const result = {};
  result.isLoading = booksAreLoading;
  result.pids = booksAreLoading ? [] : applyClientSideFilters(books, tags);
  result.pids = result.pids.map(b => b.book.pid).slice(0, max);
  result.rid = recommendedPids.rid;

  return result;
};

export const createGetFollowedLists = () =>
  createSelector(
    [
      state => state.followReducer,
      state => state.listReducer.lists,
      state => state.userReducer && state.userReducer.openplatformId
    ],
    (follows, lists, openplatformId) => {
      const result = Object.values(follows)
        .filter(follow => follow.cat === 'list')
        .map(follow => lists[follow.id])
        // list.error may occur if followed list is deleted or made private
        // just remove them
        .filter(list => list && !list.error && list._type)
        // only show lists owned by others
        .filter(list => list._owner !== openplatformId);

      return result;
    }
  );

export const getTagsFromUrl = state => {
  if (!state.routerReducer.params.tags) {
    return [];
  }
  const tags = Array.isArray(state.routerReducer.params.tags[0])
    ? state.routerReducer.params.tags[0]
    : [state.routerReducer.params.tags[0]];
  const filterCards = state.filtercardReducer;

  return tags
    .filter(id => {
      return typeof id === 'string';
    })
    .map(id => {
      if (id.includes(':')) {
        return id.split(':').map(aId => parseInt(aId, 10));
      }
      const parsed = parseInt(id, 10);
      if (getFullRange(parsed, filterCards, filtersMapAll)) {
        return [parsed, parsed];
      }
      return parsed;
    })
    .filter(id => {
      if (id instanceof Array) {
        return id.map(aId => filtersMapAll[aId]);
      }
      return filtersMapAll[id];
    });
};

export const getCreatorsFromUrl = state => {
  return state.routerReducer.params.creator
    ? state.routerReducer.params.creator
    : [];
};

export const getTitlesFromUrl = state => {
  return state.routerReducer.params.title
    ? state.routerReducer.params.title
    : [];
};

export const createGetIdsFromRange = () =>
  createSelector(
    [state => state.filtercardReducer, (state, {tags}) => tags],
    (filterCards, tags = []) => {
      let plainSelectedTagIds = [];
      tags.forEach(id => {
        if (id instanceof Array) {
          const parent = filtersMapAll[id[0]].parents[0];
          const range = filterCards[parent].range;

          const min = range.indexOf(id[0]);
          const max = range.indexOf(id[1]);

          range.forEach((aId, idx) => {
            if (idx >= min && idx <= max) {
              plainSelectedTagIds.push(aId);
            }
          });
        } else {
          plainSelectedTagIds.push(id);
        }
      });
      return plainSelectedTagIds;
    }
  );

export const getIdsFromRange = (state, aIds) => {
  const filterCards = state.filtercardReducer;
  let plainSelectedTagIds = [];
  aIds.forEach(id => {
    if (id instanceof Array) {
      const parent = filtersMapAll[id[0]].parents[0];
      const range = filterCards[parent].range;

      const min = range.indexOf(id[0]);
      const max = range.indexOf(id[1]);

      range.forEach((aId, idx) => {
        if (idx >= min && idx <= max) {
          plainSelectedTagIds.push(aId);
        }
      });
    } else {
      plainSelectedTagIds.push(id);
    }
  });
  return plainSelectedTagIds;
};

export const getTagsbyIds = (state, aIds) => {
  return aIds.map(tag => {
    if (tag instanceof Array) {
      return tag.map(aTag => filtersMapAll[aTag]);
    }
    return filtersMapAll[tag.id || tag];
  });
};

export const createCountComments = () =>
  createSelector(
    [state => state.comments, (state, {ids = []}) => ids],
    (comments, ids) => {
      let commentCount = 0;
      ids.forEach(id => {
        commentCount +=
          (comments[id] &&
            comments[id].comments &&
            comments[id].comments.length) ||
          0;
      });
      return commentCount;
    }
  );
