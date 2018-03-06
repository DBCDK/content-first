import React from 'react';
import renderer from 'react-test-renderer';

import {BookcaseItem} from '../BookcaseItem.component';

jest.mock(
  '../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);
jest.mock('../../pulse/Pulse.component', () => 'Pulse');
jest.mock('../CarouselItem.component', () => 'CarouselItem');
jest.mock('../CarouselSlider.component', () => 'CarouselSlider');

const celeb = {
  id: '1',
  name: 'Bjarne Slot Christiansen',
  img: 'img/bookcase/BS3.png',
  description: 'lorem ipsum',
  bookcase: 'img/bookcase/BS-bogreol.png',
  books: [
    {
      pid: '870970-basis:52530423',
      position: {x: 13.5, y: 40},
      description: 'lorem ipsum . . .'
    },
    {
      pid: '870970-basis:53079202',
      position: {x: 21.8, y: 44},
      description: 'lorem ipsum . . .'
    }
  ]
};

const book = [
  {
    book: {
      pid: '1234',
      creator: 'Nicole Boyle Rødtnes',
      title: 'test',
      cover: 'img/cover.png',
      description: 'lorem ipsum...'
    }
  }
];

describe('BookcaseItem', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(<BookcaseItem celeb={celeb} books={book} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
