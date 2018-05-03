import React from 'react';
import renderer from 'react-test-renderer';

import CarouselItem from '../CarouselItem.component';

jest.mock(
  '../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);
jest.mock('../../general/Link.component', () => 'Link');

const description = 'lorem ipsum . . .';

const book = {
  pid: '870970-basis:51642899',
  titel: 'Alt det lys vi ikke ser',
  creator: 'Anthony Doerr',
  description: 'Roman nder 2. verdenskrig'
};

describe('CarouselItem', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <CarouselItem
          description={description}
          onClick={() => {
            this.nextBook('next');
          }}
          book={book}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
