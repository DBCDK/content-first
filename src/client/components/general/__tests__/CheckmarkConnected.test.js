import React from 'react';
import renderer from 'react-test-renderer';

import {CheckMarkConnected} from '../CheckmarkConnected.component';

describe('CheckMarkConnected', () => {
  it('renders initial component', () => {
    const tree = renderer
      .create(
        <CheckMarkConnected
          shortListState={{elements: []}}
          isLoggedIn={false}
          book={{book: {pid: '0123'}}}
          origin="Fra egen værkside"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders initial component with loggedIn user', () => {
    const tree = renderer
      .create(
        <CheckMarkConnected
          shortListState={{elements: []}}
          isLoggedIn={true}
          book={{book: {pid: '0123'}}}
          origin="Fra egen værkside"
          systemLists={[]}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
