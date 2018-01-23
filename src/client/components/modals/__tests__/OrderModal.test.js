/* eslint-disable no-undefined */
import React from 'react';
import Immutable from 'immutable';
import {
  OrderModal,
  mapStateToProps,
  mapDispatchToProps
} from '../OrderModal.container';
import renderer from 'react-test-renderer';

jest.mock('../../general/Spinner.component', () => 'Spinner');
jest.mock('../Modal.component', () => 'Modal');
jest.mock('../../general/BookCover.component', () => 'BookCover');

const sampleBooks = Immutable.fromJS([
  {pid: 'pid1', title: 'title1', creator: 'creator1'},
  {pid: 'pid2', title: 'title2', creator: 'creator2'},
  {pid: 'pid3', title: 'title3', creator: 'creator3'}
]);
const sampleBranches = Immutable.fromJS([]);
function checkOrderModal(books) {
  const tree = renderer
    .create(<OrderModal branches={sampleBranches} orders={books} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
  return tree;
}

describe('OrderModal', () => {
  describe('render function', () => {
    it('renders initial request', () => {
      checkOrderModal(sampleBooks);
    });
  });
  it('has a working mapStateToProps', () => {
    expect(
      Immutable.fromJS(
        mapStateToProps({
          orderReducer: Immutable.fromJS({orders: {}, pickupBranches: []})
        })
      ).toJS()
    ).toEqual({branches: [], currentBranch: undefined, orders: []});
  });
  it('has a working mapDispatchToProps', () => {
    expect(Object.keys(mapDispatchToProps(() => {}))).toEqual([
      'onChangeBranch',
      'onStart',
      'onClose'
    ]);
  });
});
