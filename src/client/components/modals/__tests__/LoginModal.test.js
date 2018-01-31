/* eslint-disable no-undefined */
import React from 'react';
import {LoginModal} from '../LoginModal.component';
import renderer from 'react-test-renderer';

jest.mock('../Modal.component', () => 'Modal');

describe('LoginModal', () => {
  it('renders function', () => {
    const tree = renderer
      .create(<LoginModal context={{title: 'abc', reason: 'def'}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
