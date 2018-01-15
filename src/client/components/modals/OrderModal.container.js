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
      <div>
        <div class="form-group">
          <label>
            Du er ved at bestille{props.orders.length > 1
              ? ` ${props.orders.length} bøger`
              : ''}:
          </label>
          {props.orders.map(book => <div key={book.pid}>{book.title}</div>)}
        </div>
        <div class="form-group" style={{marginBottom: 0}}>
          <label htmlFor="pickupBranch">Til afhentning på:</label>
          <select
            class="form-control"
            id="pickupBranch"
            style={{width: 'auto'}}
          >
            <option>Foo Bibliotek</option>
            <option>Bar Bibliotek</option>
            <option>Baz Bibliotek</option>
          </select>
        </div>
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
