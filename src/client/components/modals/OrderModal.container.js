import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
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
      <div className="row">
        {props.orders.map(book => <div key={book.pid}>{book.title}</div>)}
      </div>
    </Modal>
  );
}
export function mapStateToProps(state) {
  return {
    orders: Object.values(state.orderReducer)
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
