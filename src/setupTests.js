'use strict';
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
});
