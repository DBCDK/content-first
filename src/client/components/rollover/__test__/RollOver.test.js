import React from 'react';
import renderer from 'react-test-renderer';

import RollOver from '../RollOver.component';

jest.mock(
  '../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);

const pid = '870970-basis:52038014';
const position = {x: 26, y: 46};
const description = 'lorem ipsum . . .';

const book = {
  pid: pid,
  creator: 'Nicole Boyle Rødtnes',
  title: 'test',
  cover: 'img/cover.png',
  description: description
};

describe('RollOver', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <RollOver
          loading={true}
          position={position}
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
