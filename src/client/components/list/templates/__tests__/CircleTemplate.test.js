import React from 'react';
import CircleTemplate from '../CircleTemplate.container';
import renderer from 'react-test-renderer';

jest.mock('../../../general/BookCover.component', () => 'BookCover');
jest.mock('../../../general/PopOver.component', () => 'PopOver');
jest.mock('../../../general/ProfileImage.component', () => 'ProfileImage');
jest.mock(
  '../../../general/CheckmarkConnected.component',
  () => 'CheckmarkConnected'
);
jest.mock('../SimpleList.component', () => 'SimpleList');
jest.mock('../BookcaseTemplate.component', () => 'BookcaseTemplate');

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

const profile = {
  name: 'LæseLotte',
  src: 'http://p-hold.com/200/200'
};

describe('CircleTemplate', () => {
  test('circle of list items is shown', () => {
    const list = {
      id: 'current-list-id',
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
      .create(<CircleTemplate list={list} profile={profile} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
