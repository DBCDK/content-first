import React from 'react';
import {Provider} from 'react-redux';
import ListCreate from '../ListCreate.component';
import renderer from 'react-test-renderer';
import {createStore, combineReducers} from 'redux';
import listReducer, {
  REMOVE_ELEMENT_FROM_LIST
} from '../../../redux/list.reducer';

import {ADD_ELEMENT_TO_LIST} from '../../../redux/list.reducer';

const reducer = (state, action) => {
  if (action.type === 'CLEAR_STATE') {
    return {
      listReducer: {
        lists: [],
        currentList: {
          title: '',
          description: '',
          list: []
        }
      }
    };
  }
  return combineReducers({
    listReducer
  })(state, action);
};

jest.mock('react-textarea-autosize', () => 'textarea');
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
  test('CreateList component is rendered', () => {
    const tree = renderer
      .create(
        <Provider store={createStore(reducer)}>
          <ListCreate />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('a book is added to the list', () => {
    const store = createStore(reducer);
    store.dispatch({type: 'CLEAR_STATE'});
    store.dispatch({type: ADD_ELEMENT_TO_LIST, element: createTestElement(1)});
    const tree = renderer
      .create(
        <Provider store={store}>
          <ListCreate />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('multible books are added to the list', () => {
    const store = createStore(reducer);
    store.dispatch({type: 'CLEAR_STATE'});
    store.dispatch({type: ADD_ELEMENT_TO_LIST, element: createTestElement(1)});
    store.dispatch({type: ADD_ELEMENT_TO_LIST, element: createTestElement(2)});
    store.dispatch({type: ADD_ELEMENT_TO_LIST, element: createTestElement(3)});
    const tree = renderer
      .create(
        <Provider store={store}>
          <ListCreate />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('a books is removed from the list', () => {
    const store = createStore(reducer);
    store.dispatch({type: 'CLEAR_STATE'});
    store.dispatch({type: ADD_ELEMENT_TO_LIST, element: createTestElement(1)});
    store.dispatch({type: ADD_ELEMENT_TO_LIST, element: createTestElement(2)});
    store.dispatch({
      type: REMOVE_ELEMENT_FROM_LIST,
      element: createTestElement(2)
    });
    const tree = renderer
      .create(
        <Provider store={store}>
          <ListCreate />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
