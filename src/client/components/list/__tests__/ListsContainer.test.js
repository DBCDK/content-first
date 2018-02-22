import React from 'react';
import {Lists} from '../Lists.container';
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
    title: 'some list',
    description: 'some description',
    list: [createTestElement(1), createTestElement(2), createTestElement(3)]
  };
};

describe('Lists Container', () => {
  test('List is rendered', () => {
    const tree = renderer.create(<Lists lists={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
    tree.props.lists = [createList(1), createList(2)];
    expect(tree).toMatchSnapshot();
  });
});
