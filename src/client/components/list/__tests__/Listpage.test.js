import React from 'react';
import {ListPage} from '../ListPage.container';
import renderer from 'react-test-renderer';

const createTestElement = id => {
  return {
    book: {
      pid: 'pid' + id,
      title: 'some title ' + id,
      creator: 'some creator' + id
    },
    links: {
      cover: '/cover' + id
    },
    description: 'some description' + id
  };
};

const createList = id => {
  return {
    id: id,
    owner: 'owner1',
    title: 'some list',
    description: 'some description',
    list: [createTestElement(1), createTestElement(2), createTestElement(3)]
  };
};
const profiles = {
  owner1: {
    name: 'Frans'
  }
};

jest.mock(
  '../../work/WorkItemConnected.component.js',
  () => 'WorkItemConnectedMock'
);

jest.mock('../../comments/Comment.container.js', () => 'Comments');
jest.mock('../../list/templates/SimpleList.component.js', () => 'Comments');
jest.mock('../../list/templates/CircleTemplate.container.js', () => 'Comments');

describe('ListView', () => {
  test('List is rendered', () => {
    const list = createList('list1');
    const tree = renderer
      .create(<ListPage id="list1" list={list} profiles={profiles} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('edit button enabled, when isOwner true', () => {
    const list = createList('list1');
    const tree = renderer
      .create(
        <ListPage id="list1" list={list} profiles={profiles} isOwner={true} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
