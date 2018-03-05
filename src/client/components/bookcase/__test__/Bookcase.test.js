import React from 'react';
import renderer from 'react-test-renderer';

import {Bookcase} from '../Bookcase.component';

jest.mock('../BookcaseItem.component', () => 'BookcaseItem');
jest.mock('../BookcaseSlider.component', () => 'BookcaseSlider');

const celebs = [
  {
    id: '1',
    name: 'John Doe',
    img: 'img/jd.png',
    description: 'lorem ipsum',
    bookcase: 'img/jd-bogreol.png',
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
  },
  {
    id: '2',
    name: 'Jane Doe',
    img: 'img/jd.png',
    description: 'lorem ipsum',
    bookcase: 'img/jd-bogreol.png',
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
  }
];

describe('Bookcase', () => {
  it('renders initial component', () => {
    const tree = renderer.create(<Bookcase celebs={celebs} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
