import React from 'react';
import App from '../App';
import {Provider} from 'react-redux';
import createStore from '../redux/Store';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  window.$ = () => ({tooltip: () => {}}); // mock jquery tooltip
  const tree = renderer
    .create(<Provider store={createStore()}><App /></Provider>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
