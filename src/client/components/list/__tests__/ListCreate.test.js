import React from 'react';
import {ListCreator} from '../ListCreate.container';
import renderer from 'react-test-renderer';

jest.mock('react-textarea-autosize', () => 'textarea');
jest.mock('../../general/BookCover.component', () => 'BookCover');
jest.mock('../../general/Link.component', () => 'Link');
const createTestElement = id => {
  return {
    book: {
      pid: 'pid' + id,
      title: 'some title' + id,
      creator: 'some creator' + id
    },
    links: {
      cover: '/cover' + id
    },
    description: 'some description' + id
  };
};

describe('ListCreate', () => {
  test('list details is shown', () => {
    const currentList = {
      data: {
        id: 'current-list-id',
        title: 'some title',
        description: 'some description',
        public: true,
        list: []
      },
      links: {self: null}
    };

    const tree = renderer
      .create(<ListCreator id="current-list-id" currentList={currentList} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders a list with one book', () => {
    const currentList = {
      data: {
        id: 'current-list-id',
        title: 'some title',
        description: 'some description',
        public: false,
        list: [createTestElement(1)]
      },
      links: {self: null}
    };
    const tree = renderer
      .create(<ListCreator id="current-list-id" currentList={currentList} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders a list with multiple books', () => {
    const currentList = {
      data: {
        id: 'current-list-id',
        title: 'some title',
        description: 'some description',
        public: false,
        list: [createTestElement(3), createTestElement(2), createTestElement(1)]
      },
      links: {self: null}
    };
    const tree = renderer
      .create(<ListCreator id="current-list-id" currentList={currentList} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
