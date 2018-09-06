import React from 'react';
import BookcaseTemplate from '../BookcaseTemplate.component';
import renderer from 'react-test-renderer';

jest.mock('../SimpleList.component', () => 'SimpleList');
jest.mock('../../../bookcase/BookcaseItem.component', () => 'BookcaseItem');

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
    position: {x: 0, y: 0},
    description: 'some description' + id
  };
};

const profile = {
  name: 'LæseLotte',
  src: 'http://p-hold.com/200/200',
  image: 'http://p-hold.com/200/200'
};

describe('BookcaseTemplate', () => {
  test('circle of list items is shown', () => {
    const list = {
      _id: 'current-list-id',
      title: 'some title',
      description: 'some description',
      public: true,
      list: [
        createTestElement(1),
        createTestElement(2),
        createTestElement(3),
        createTestElement(4),
        createTestElement(5),
        createTestElement(6)
      ]
    };

    const tree = renderer
      .create(<BookcaseTemplate list={list} profile={profile} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
