/*
Selectors working on the global state object
*/

import {getBooks} from './books.reducer';
import {getRecommendedPids, applyClientSideFilters} from './recommend';

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
  result.books = result.isLoading
    ? []
    : applyClientSideFilters(getBooks(booksReducer, r.pids), tags);
  result.books = result.books.slice(0, max);
  return result;
};
