import React from 'react';
import App from '../App';
import {Provider} from 'react-redux';
import createStore from '../redux/Store';
import renderer from 'react-test-renderer';

// jest.mock('../../data/exportTaxonomy.json', () => {
//   return require('./__mocks__/mockedTaxonomy.json');
// });

jest.mock('../components/belt/Slider.component', () => 'slider');
jest.mock('../components/bookcase/Bookcase.component', () => 'Bookcase');
jest.mock('../components/belt/BeltFacade.component', () => 'BooksBelt');
jest.mock('../components/spots/Spots.container.js', () => 'SpotsContainer');
jest.mock('../components/hero/Hero.component.js', () => 'Hero');
jest.mock('../components/hero/Spot.component.js', () => 'Spot');

it('renders without crashing', () => {
  window.$ = () => ({tooltip: () => {}}); // mock jquery tooltip
  const tree = renderer
    .create(
      <Provider store={createStore()}>
        <App />
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
