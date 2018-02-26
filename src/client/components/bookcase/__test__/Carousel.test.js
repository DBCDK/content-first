import React from 'react';
import renderer from 'react-test-renderer';

import Carousel from '../Carousel.component';

jest.mock(
  '../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);

const pid = '870970-basis:52038014';
const position = {x: 26, y: 46};
const description = 'lorem ipsum . . .';

const book = [
  {
    book: {
      pid: pid,
      creator: 'Nicole Boyle Rødtnes',
      title: 'test',
      cover: 'img/cover.png',
      description: description
    }
  }
];

describe('Carousel', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <Carousel
          loading={true}
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
