import React from 'react';
import AddToListModal from '../AddToListModal.component';
import renderer from 'react-test-renderer';
import createStore from '../../../redux/Store';
import {ADD_LIST} from '../../../redux/list.reducer';
import {createTestList, createTestElement} from '../../../utils/testHelper';

describe('AddToListModal', () => {
  test('modal is hidden', () => {
    const tree = renderer
      .create(
        <AddToListModal
          show={false}
          work={createTestElement(1)}
          lists={[]}
          onClose={() => {}}
          onDone={() => {}}
          onAddList={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('modal is visible, renders lists from store', () => {
    const store = createStore();
    store.dispatch({type: ADD_LIST, list: createTestList(1)});
    store.dispatch({type: ADD_LIST, list: createTestList(2)});

    const tree = renderer
      .create(
        <AddToListModal
          show={true}
          work={createTestElement(1)}
          lists={store.getState().listReducer.lists}
          onClose={() => {}}
          onDone={() => {}}
          onAddList={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
