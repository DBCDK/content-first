'use strict';
// TODO: Remove this `raf` polyfill once the below issue is sorted
// https://github.com/facebookincubator/create-react-app/issues/3199#issuecomment-332842582
import raf from './raf-shim'; // eslint-disable-line
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});
require('jest-localstorage-mock');
[
  'exportTaxonomy.json',
  'ranked-profiles.json',
  'similar-pids.json',
  'exportTags.json',
  'librarian-recommends.json',
  'pidinfo.json'
].forEach(mockJson => {
  jest.mock(
    `./data/${mockJson}`,
    () => require(`./data/examples/${mockJson}`),
    {
      virtual: true
    }
  );
jest.mock('react-textarea-autosize', () => 'textarea');
jest.mock('react-slick', () => 'react-slick');
jest.mock('react-truncate-markup', () => 'react-truncate-markup');

});
