import React from 'react';
import {Provider} from 'react-redux';
import createStore from '../../../redux/Store';
import ShortList from '../ShortList.container';
import {mount} from 'enzyme';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../../redux/shortlist.reducer';

const createTestElement = id => {
  return {
    book: {
      pid: 'pid' + id,
      title: 'some title' + id,
      taxonomy_description: 'some description' + id
    },
    origin: 'Minder om noget' + id
  };
};
const addElement = (store, id) => {
  const {book, origin} = createTestElement(id);
  store.dispatch({type: ON_SHORTLIST_TOGGLE_ELEMENT, element: {book}, origin});
};

describe('ShortList.container', () => {
  test('short list is empty', () => {
    const store = createStore();
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    expect(tree).toMatchSnapshot();
  });

  test('short list contains elements', () => {
    const store = createStore();
    addElement(store, 1);
    addElement(store, 2);
    addElement(store, 3);
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    expect(tree).toMatchSnapshot();
  });

  test('remove element', () => {
    const store = createStore();
    addElement(store, 1);
    addElement(store, 2);
    addElement(store, 3);
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    tree
      .find('.item .remove-btn')
      .first()
      .simulate('click');
    expect(tree).toMatchSnapshot();
  });

  test('change description reveal cancel and submit buttons', () => {
    const store = createStore();
    addElement(store, 1);
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    tree
      .find('.item textarea')
      .first()
      .simulate('change', {target: {value: 'description is changed'}});
    expect(tree).toMatchSnapshot();
  });

  test('Saving changed description, is hiding buttons and showing new value', () => {
    const store = createStore();
    addElement(store, 1);
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    tree
      .find('.item textarea')
      .first()
      .simulate('change', {target: {value: 'description is changed'}});
    tree
      .find('.item form')
      .first()
      .simulate('submit');
    expect(tree).toMatchSnapshot();
  });

  test('cancel changed description, is hiding buttons and showing old value', () => {
    const store = createStore();
    addElement(store, 1);
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    tree
      .find('.item textarea')
      .first()
      .simulate('change', {target: {value: 'description is changed'}});
    tree
      .find('.item .btn-default')
      .first()
      .simulate('click');
    expect(tree).toMatchSnapshot();
  });

  test('cancel changed description, is hiding buttons and showing old value', () => {
    const store = createStore();
    addElement(store, 1);
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    tree
      .find('.item textarea')
      .first()
      .simulate('change', {target: {value: 'description is changed'}});
    tree
      .find('.item .btn-default')
      .first()
      .simulate('click');
    expect(tree).toMatchSnapshot();
  });

  test('Clearing list', () => {
    const store = createStore();
    addElement(store, 1);
    addElement(store, 2);
    const tree = mount(
      <Provider store={store}>
        <ShortList />
      </Provider>
    );
    tree
      .find('.clear-all-btn')
      .first()
      .simulate('click');
    tree.update();
    expect(tree).toMatchSnapshot();
  });
});
