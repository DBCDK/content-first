import React from 'react';
import {Provider} from 'react-redux';
import ListPage from '../ListPage.container';
import renderer from 'react-test-renderer';
import {createStore, combineReducers} from 'redux';
import listReducer, {addList} from '../../../redux/list.reducer';
import {usersReducer} from '../../../redux/users';

const reducer = (state, action) => {
  if (action.type === 'CLEAR_STATE') {
    return {
      listReducer: {
        lists: {}
      }
    };
  }
  return combineReducers({
    listReducer,
    users: usersReducer
  })(state, action);
};

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

jest.mock(
  '../../work/WorkItemConnected.component.js',
  () => 'WorkItemConnectedMock'
);

jest.mock('../../comments/Comment.container.js', () => 'Comments');
jest.mock('../../list/templates/SimpleList.component.js', () => 'Comments');
jest.mock('../../list/templates/CircleTemplate.container.js', () => 'Comments');

describe('ListView', () => {
  test('List is rendered', () => {
    const store = createStore(reducer);
    store.dispatch(addList(createList('list1')));
    const tree = renderer
      .create(
        <Provider store={store}>
          <ListPage id="list1" />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('no list is rendered when id is invalid', () => {
    const store = createStore(reducer);
    const tree = renderer
      .create(
        <Provider store={store}>
          <ListPage id="list1" />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
