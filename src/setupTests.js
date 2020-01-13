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
});
jest.mock('react-textarea-autosize', () => 'textarea');
jest.mock('react-truncate-markup', () => 'react-truncate-markup');
jest.mock('react-visibility-sensor', () => 'react-visibility-sensor');

jest.mock('!raw-loader!../components/article/pages/404.md', () => '404.md', {
  virtual: true
});
jest.mock(
  '!raw-loader!../components/article/pages/about.md',
  () => 'about.md',
  {
    virtual: true
  }
);
jest.mock(
  '!raw-loader!../components/article/pages/loginError.md',
  () => 'loginError.md',
  {
    virtual: true
  }
);

jest.mock('./client/components/list/button/PrintButton', () =>
  jest.fn(() => 'PrintButton')
);

jest.mock('./client/components/base/Head', () => jest.fn(() => 'Head'));

jest.mock(
  './client/components/general/BookCover/BookCover.component',
  () => 'bookcover'
);
jest.mock('tween', () => 'tween', {
  virtual: true
});
jest.mock('tween', () => 'tween', {
  virtual: true
});
