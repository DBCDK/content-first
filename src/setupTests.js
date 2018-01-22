'use strict';
// TODO: Remove this `raf` polyfill once the below issue is sorted
// https://github.com/facebookincubator/create-react-app/issues/3199#issuecomment-332842582
import raf from './raf-shim'; // eslint-disable-line
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});
require('jest-localstorage-mock');
jest.mock('react-textarea-autosize', () => 'textarea');
jest.mock('react-slick', () => 'react-slick');
jest.mock('react-truncate-markup', () => 'react-truncate-markup');
jest.mock('./client/data/exportTaxonomy.json', () => {
  return require('./client/__tests__/__mocks__/mockedTaxonomy.json');
});
