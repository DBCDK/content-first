import React from 'react';
import {AddToList} from '../AddToList.container';
import {shallow} from 'enzyme';

const createTestElement = id => {
  return {
    pid: 'pid' + id,
    links: {
      cover: '/cover' + id
    },
    description: 'some description' + id
  };
};

const createList = _id => {
  return {
    _id,
    title: 'some list',
    description: 'some description',
    list: [createTestElement(1), createTestElement(2), createTestElement(3)]
  };
};

describe('AddToList', () => {
  test('is empty when list is undefined', () => {
    const tree = shallow(<AddToList allowAdd={true} />);
    expect(tree).toMatchSnapshot();
  });
  test('is empty when allowAdd is false', () => {
    const tree = shallow(<AddToList list={createList(1)} allowAdd={false} />);
    expect(tree).toMatchSnapshot();
  });
  test('render when allowAdd is true', () => {
    const tree = shallow(<AddToList list={createList(1)} allowAdd={true} />);
    expect(tree).toMatchSnapshot();
  });
  test('show error msg when selected books is already in list', () => {
    const list = createList(1);
    const tree = shallow(<AddToList list={list} allowAdd={true} />);
    tree.setState({elementToAdd: list.list[0]});
    expect(tree).toMatchSnapshot();
  });
  test('show add and cancel buttons when selected book is not in list', () => {
    const list = createList(1);
    const tree = shallow(<AddToList list={list} allowAdd={true} />);
    tree.setState({elementToAdd: createTestElement(10)});
    expect(tree).toMatchSnapshot();
  });
  test('invoke requireLogin, when add button is clicked when not logged in', () => {
    const list = createList(1);
    const element = createTestElement(10);
    let requireLoginInvoked = false;
    let addElementInvoked = false;
    const tree = shallow(
      <AddToList
        list={list}
        allowAdd={true}
        isLoggedIn={false}
        requireLogin={() => (requireLoginInvoked = true)}
        addElement={() => (addElementInvoked = true)}
      />
    );
    tree.instance().submit(element);
    expect(requireLoginInvoked).toBe(true);
    expect(addElementInvoked).toBe(false);
  });
  test('invoke addElement, when add button is clicked when logged in', () => {
    const list = createList(1);
    const element = createTestElement(10);
    let requireLoginInvoked = false;
    let addElementInvoked = false;
    const tree = shallow(
      <AddToList
        list={list}
        allowAdd={true}
        isLoggedIn={true}
        requireLogin={() => (requireLoginInvoked = true)}
        addElementToList={() => (addElementInvoked = true)}
      />
    );
    tree.instance().submit(element);
    expect(requireLoginInvoked).toBe(false);
    expect(addElementInvoked).toBe(true);
  });
});
