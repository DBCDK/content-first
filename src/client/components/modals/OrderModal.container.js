import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import BookCover from '../general/BookCover.component';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {SET_CURRENT_BRANCH} from '../../redux/order.reducer';

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
        <div className="form-group">
          <label>
            Du er ved at bestille{props.orders.size > 1 &&
              ` ${props.orders.size} bøger`}:
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
            {props.orders.map(book => {
              const loading = !book.get('availability');
              let status = '';
              if(book.getIn(['availability', 'holdingStatus', 'willLend']) === false) {
                      status = <span style={{color: 'red'}}>
                        Kan ikke bestilles<br />til dit bibliotek.
                      </span>
              }
              if(!book.get('availability')) {
                status = <span
                        className="spinner"
                        style={{
                          display: 'inline-block',
                          marginTop: 10,
                          width: 30,
                          height: 30
                        }}
                      />
              }
              return <div className="row short-list-page" key={book.get('pid')}>
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
                  <div
                    style={{
                      display: 'inline-block',
                      height: 60,
                      float: 'right',
                      marginRight: 10
                    }}
                  ><small>{status}</small>
                  </div>
                  <div className="title">{book.get('title')}</div>
                  <div className="creator">{book.get('creator')}</div>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="form-group" style={{marginBottom: 0}}>
          <label htmlFor="pickupBranch">Til afhentning på:</label>
          <select
            className="form-control"
            id="pickupBranch"
            style={{width: 'auto'}}
            onChange={props.onChangeBranch}
            value={props.currentBranch}
          >
            {props.branches.map(branch => (
              <option key={branch.get('branchId')} value={branch.get('branchId')}>
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
    branches: state.orderReducer.get('pickupBranches'),
    currentBranch: state.orderReducer.get('currentBranch')
  };
}
export function mapDispatchToProps(dispatch) {
  return {
    onChangeBranch: (o) => {
      dispatch({type: SET_CURRENT_BRANCH, branch: o.target.value});
    },
    onDone: () => {
      dispatch({type: CLOSE_MODAL, modal: 'order'});
    },
    onClose: () => {
      dispatch({type: CLOSE_MODAL, modal: 'order'});
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderModal);
