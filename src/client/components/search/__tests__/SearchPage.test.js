import React from 'react';
import {
  SearchPage,
  mapStateToProps,
  mapDispatchToProps
} from '../SearchPage.container';
import renderer from 'react-test-renderer';

describe('SearchPage', () => {
  describe('render function', () => {
    it('displays search results', () => {
      const tree = renderer
        .create(
          <SearchPage
            searching={false}
            query={'søgeforespørgsel'}
            results={[{pid: '123:samplepid-456', title: 'Titel', creator: 'Forfatter'}]}
            onSearch={() => {}}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('gives a message, when no search results are present', () => {
      const tree = renderer
        .create(
          <SearchPage
            searching={false}
            query={'søgeforespørgsel'}
            onSearch={() => {}}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  it('has a working mapStateToProps', () => {
    expect(
      mapStateToProps({
        searchReducer: {
          query: 'q',
          loading: 'l',
          results: []
        }
      })
    ).toEqual({
      query: 'q',
      searching: 'l',
      results: []
    });
  });
  it('has a working mapDispatchToProps', () => {
    expect(Object.keys(mapDispatchToProps(() => {}))).toEqual(['onSearch']);
  });
});
