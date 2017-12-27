import searchReducer, {SEARCH_QUERY, SEARCH_RESULTS} from '../search.reducer';

describe('search.reducer', () => {
  it('handles new queries', () => {
    expect(
      searchReducer({existing: 'state'}, {type: SEARCH_QUERY, query: 'william'})
    ).toEqual({
      existing: 'state',
      loading: true,
      results: null,
      query: 'william'
    });
  });
  it('handles incoming search result', () => {
    expect(
      searchReducer(
        {existing: 'state', query: 'q'},
        {type: SEARCH_RESULTS, results: [{pid: 'p', title: 't', creator: 'c'}]}
      )
    ).toEqual({
      existing: 'state',
      loading: false,
      results: [{pid: 'p', title: 't', creator: 'c'}]
    });
  });
});
