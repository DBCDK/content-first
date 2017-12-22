import React from 'react';
import {Provider} from 'react-redux';
import AddToListModal from '../AddToListModal.container';
import renderer from 'react-test-renderer';
import createStore from '../../../redux/Store';
import {ADD_LIST} from '../../../redux/list.reducer';
import {createTestList, createTestElement} from '../../../utils/testHelper';

// for ref in AddToListModal not to be null
function createNodeMock() {
  return {};
}

describe('AddToListModal', () => {
  const store = createStore();
  store.dispatch({type: ADD_LIST, list: createTestList(1)});
  store.dispatch({type: ADD_LIST, list: createTestList(2)});
  const tree = renderer.create(
    <Provider store={store}>
      <AddToListModal work={createTestElement(1)} />
    </Provider>,
    {createNodeMock}
  );
  test('renders lists from store, first is selected', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });
  test('newly added list is selected', () => {
    store.dispatch({type: ADD_LIST, list: createTestList(3)});
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
