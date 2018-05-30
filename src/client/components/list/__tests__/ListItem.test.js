import React from 'react';
import renderer from 'react-test-renderer';
import ListItem from '../ListItem.component';

jest.mock('../../general/BookCover.component', () => 'BookCover');
jest.mock('../../general/Link.component', () => 'Link');

describe('ListItem', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <ListItem
          list={[]}
          title={'some-title'}
          id={'some-id'}
          key={'some-id'}
          type={'some-type'}
          image={null}
          hideIfEmpty={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
