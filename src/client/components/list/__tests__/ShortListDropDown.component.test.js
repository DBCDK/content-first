import React from 'react';
import {Provider} from 'react-redux';
import createStore from '../../../redux/Store';
import ShortListDropDown from '../ShortListDropDown.container';
import renderer from 'react-test-renderer';
import {ON_SHORTLIST_TOGGLE_ELEMENT, SHORTLIST_LOAD_RESPONSE} from '../../../redux/shortlist.reducer';

const createTestElement = (id) => {
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

describe('ShortListDropDown', () => {
  test('short list is empty and merge modal is hidden', () => {
    const tree = renderer
      .create(<Provider store={createStore()}><ShortListDropDown /></Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('short list contains single element', () => {
    const store = createStore();
    addElement(store, 1);
    const tree = renderer
      .create(<Provider store={store}><ShortListDropDown /></Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('short list contains more than 3 elements, elements are added to top of list', () => {
    const store = createStore();
    addElement(store, 1);
    addElement(store, 2);
    addElement(store, 3);
    addElement(store, 4);
    const tree = renderer
      .create(<Provider store={store}><ShortListDropDown /></Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('modal is visible when merge is required', () => {
    const store = createStore();
    store.dispatch({
      type: SHORTLIST_LOAD_RESPONSE,
      localStorageElements: [createTestElement(2), createTestElement(3), createTestElement(4)],
      databaseElements: [createTestElement(1), createTestElement(2)]
    });
    const tree = renderer
      .create(<Provider store={store}><ShortListDropDown /></Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
