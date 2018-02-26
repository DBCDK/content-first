import React from 'react';
import renderer from 'react-test-renderer';

import {Bookcase} from '../Bookcase.component';

jest.mock(
  '../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);
jest.mock('../../pulse/Pulse.component', () => 'Pulse');
jest.mock('../../rollover/RollOver.component', () => 'RollOver');

const bookcaseStateOBJ = {
  books: [
    {
      pid: '870970-basis:52038014',
      position: {x: 26, y: 46},
      description: 'lorem ipsum. . .'
    },
    {
      pid: '870970-basis:23211629',
      position: {x: 36.5, y: 46},
      description: 'lorem ipsum. . .'
    }
  ]
};

const workStateOBJ = {
  pid: '870970-basis:52530423',
  creator: 'Nicole Boyle Rødtnes',
  title: 'test',
  cover: 'img/cover.png',
  description: 'lorem ipsum. . .'
};

describe('Bookcase', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <Bookcase bookcaseState={bookcaseStateOBJ} booksState={workStateOBJ} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
