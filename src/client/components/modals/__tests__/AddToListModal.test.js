import React from 'react';
import {AddToListModal} from '../AddToListModal.container';
import renderer from 'react-test-renderer';
import {createTestList, createTestElement} from '../../../utils/testHelper';

jest.mock('../../general/BookCover.component', () => 'BookCover');
jest.mock('../../work/WorkItemSmall.component', () => 'WorkItemSmall');

// for ref in AddToListModal not to be null
function createNodeMock() {
  return {};
}

describe('AddToListModal', () => {
  let tree = renderer.create(
    <AddToListModal
      work={createTestElement(1)}
      customLists={[createTestList(1), createTestList(2)]}
      systemLists={[createTestList(1), createTestList(2), createTestList(3)]}
    />,
    {
      createNodeMock
    }
  );
  test('renders lists from store, first is selected', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });
  test('newly added list is selected', () => {
    tree.update(
      <AddToListModal
        work={createTestElement(1)}
        customLists={[createTestList(1), createTestList(2), createTestList(3)]}
        systemLists={[createTestList(1), createTestList(2), createTestList(3)]}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  test('multiple works as input', () => {
    tree = renderer.create(
      <AddToListModal
        works={[createTestElement(1), createTestElement(2)]}
        customLists={[createTestList(1), createTestList(2)]}
        systemLists={[createTestList(1), createTestList(2), createTestList(3)]}
      />,
      {
        createNodeMock
      }
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
