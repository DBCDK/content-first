/*
Selectors working on the global state object
*/

import {getBooks} from './books.reducer';
import {getRecommendedPids, applyClientSideFilters} from './recommend';
import {filtersMapAll} from './filter.reducer';
import {getListByIdSelector} from './list.reducer';

const getListById = getListByIdSelector();

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

  return result;
};

export const getFollowedLists = state => {
  const follows = state.followReducer;
  const result = Object.values(follows)
    .filter(follow => follow.cat === 'list')
    .map(follow => getListById(state, {_id: follow.id}))
    .filter(list => list);

  return result;
};

export const getTagsFromUrl = state => {
  return state.routerReducer.params.tag
    ? state.routerReducer.params.tag
        .map(id => {
          if (id instanceof Array) {
            return id.map(aId => parseInt(aId, 10));
          }
          return parseInt(id, 10);
        })
        .filter(id => {
          if (id instanceof Array) {
            return id.map(aId => filtersMapAll[aId]);
          }
          return filtersMapAll[id];
        })
    : [];
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
