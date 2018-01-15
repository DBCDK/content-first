import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import BookCover from '../general/BookCover.component';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

export function OrderModal(props) {
  return (
    <Modal
      className="add-to-list--modal"
      header={'BESTIL'}
      onClose={props.onClose}
      onDone={props.onDone}
      doneText="JA TAK, BESTIL NU"
    >
      <div>
        <div class="form-group">
          <label>
            Du er ved at bestille{props.orders.length > 1 &&
              ` ${props.orders.length} bøger`}:
          </label>
          <div
            style={{
              background: 'white',
              scroll: 'auto',
              maxHeight: 250,
              overflowY: 'scroll',
              overflowX: 'hidden'
            }}
          >
            {props.orders.map(book => (
              <div className="row short-list-page" key={book.get('pid')}>
                <div
                  className="col-xs-12"
                  style={{
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderTop: '1px solid #ccc'
                  }}
                >
                  <span
                    className="book-cover"
                    style={{height: 60, float: 'left', marginRight: 10}}
                  >
                    <BookCover book={book.toJS()} />
                  </span>
                  <div className="title">{book.get('title')}</div>
                  <div className="creator">{book.get('creator')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="form-group" style={{marginBottom: 0}}>
          <label htmlFor="pickupBranch">Til afhentning på:</label>
          <select
            class="form-control"
            id="pickupBranch"
            style={{width: 'auto'}}
          >
            {props.branches.map(branch => (
              <option key={branch.get('id')} value={branch.get('id')}>
                {branch.getIn(['branchName', 0])}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
export function mapStateToProps(state) {
  return {
    orders: state.orderReducer.get('orders').valueSeq(),
    branches: state.orderReducer.get('pickupBranches')
  };
}
export function mapDispatchToProps(dispatch) {
  return {
    onDone: () => {
      dispatch({type: CLOSE_MODAL, modal: 'order'});
    },
    onClose: () => {
      dispatch({type: CLOSE_MODAL, modal: 'order'});
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderModal);
