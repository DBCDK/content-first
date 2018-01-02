import React from 'react';
import SearchField from '../SearchField.component';
import renderer from 'react-test-renderer';

describe('SearchField', () => {
  it('renders correctly with style', () => {
    const tree = renderer
      .create(
        <SearchField
          style={{margin: 10}}
          searching={false}
          onSearch={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('displays spinner when searching', () => {
    const tree = renderer
      .create(<SearchField searching={true} onSearch={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
