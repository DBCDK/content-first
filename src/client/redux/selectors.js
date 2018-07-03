/*
Selectors working on the global state object
*/

import {getBooks} from './books.reducer';
import {getRecommendedPids, applyClientSideFilters} from './recommend';

import {getListById} from './list.reducer';

export const getRecommendedBooks = (state, tags, max) => {
  const {recommendReducer, booksReducer} = state;
  const result = {tags};
  const r = getRecommendedPids(recommendReducer, {tags});
  const books = getBooks(booksReducer, r.pids);
  let booksAreLoading = false;

  books.forEach(b => {
    if (b.isLoading) {
      booksAreLoading = true;
    }
  });

  result.isLoading = r.isLoading || booksAreLoading || false;
  result.books = result.isLoading ? [] : applyClientSideFilters(books, tags);
  result.books = result.books.slice(0, max);
  return result;
};

export const getFollowedLists = state => {
  const {listReducer} = state;
  const follows = state.followReducer;

  const result = Object.values(follows)
    .filter(follow => follow.cat === 'list')
    .map(follow => getListById(state, follow.id))
    .filter(list => list);

  return result;
};
