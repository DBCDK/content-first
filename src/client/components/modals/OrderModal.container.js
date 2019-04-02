import React from 'react';
import {connect} from 'react-redux';
import Spinner from '../general/Spinner.component';
import Modal from './Modal.component';
import BookCover from '../general/BookCover.component';
import T from '../base/T';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {
  SET_CURRENT_BRANCH,
  ORDER_START,
  ORDER_DONE
} from '../../redux/order.reducer';

export function OrderState({book}) {
  if (book.orderState === 'ordered') {
    return (
      <span style={{color: 'green'}}>
        <T component="order" name="orderDone" />
      </span>
    );
  }
  if (book.orderState === 'error') {
    return (
      <span style={{color: 'red'}}>
        <T component="order" name="orderError" />
      </span>
    );
  }
  if (book.orderState === 'ordering') {
    return (
      <span>
        <Spinner size={12} style={{marginTop: 5, marginLeft: 18}} />
        <T component="order" name="orderInProgress" />
      </span>
    );
  }
  if (!book.availability) {
    return (
      <span style={{textAlign: 'center', display: 'inline-block'}}>
        <Spinner size={12} style={{marginTop: 5}} />
        <T component="order" name="orderAvailability" />
      </span>
    );
  }
  if (book.availability.orderPossible === false) {
    return (
      <span style={{color: 'red'}}>
        <T component="order" name="notYourLibrary" />
      </span>
    );
  }
  if (book.availability.orderPossible === true) {
    return (
      <div style={{color: '#666', textAlign: 'center'}}>
        <T component="order" name="orderPossible" />
      </div>
    );
  }
  return '';
}

function orderInfo({orders, onStart, currentBranch, branches}) {
  let orderError = 0;
  let orderSuccess = 0;
  let orderable = [];
  let reviewingOrder = false;
  let ordering = false;
  let doneText, onDone;
  let orderStatus = '';
  let unavailableCount = 0;

  for (const o of orders) {
    const state = o.orderState;
    const unavailable = o.availability
      ? o.availability.orderPossible === false
      : false;
    if (unavailable) {
      ++unavailableCount;
    }
    if (state === 'ordered') {
      ++orderSuccess;
    }
    if (
      state !== 'ordered' &&
      state !== 'error' &&
      state !== 'ordering' &&
      !unavailable
    ) {
      doneText = <T component="order" name="orderNow" />;
      onDone = () => onStart(orderable, currentBranch || branches[0].branchId);
      reviewingOrder = true;
    }
    if (state === 'error') {
      ++orderError;
    }
    if (state === 'ordering') {
      ordering = true;
      doneText = <T component="order" name="orderInProgress" />;
      onDone = () => {};
      orderStatus = (
        <span>
          <Spinner size={32} style={{margin: 8}} />
          <T component="order" name="orderInProgress" />
        </span>
      );
    }
    if (!unavailable && state !== 'ordered') {
      orderable.push(o);
    }
  }

  return {
    orderError,
    orderSuccess,
    doneText,
    onDone,
    orderStatus,
    unavailableCount,
    reviewingOrder,
    ordering
  };
}

export function OrderModal(props) {
  let {
    ordering,
    orderError,
    orderSuccess,
    doneText,
    onDone,
    orderStatus,
    unavailableCount,
    reviewingOrder
  } = orderInfo(props);

  const bookOrBooks = T({
    component: 'general',
    name: props.orders.length === 1 ? 'book' : 'books'
  });

  if (!reviewingOrder && !ordering) {
    doneText = 'OK';
    onDone = props.onClose;
    if (orderError) {
      orderStatus = (
        <div>
          <span
            style={{
              background: '#c00',
              display: 'inline-block',
              textAlign: 'center',
              color: '#fcfcfc',
              width: 25,
              height: 25,
              borderRadius: 20,
              fontSize: 20
            }}
          >
            ❌
          </span>
          <div style={{color: 'red'}} data-cy="order-status">
            <T component="order" name="anErrorOccured" vars={[orderError]} />
          </div>
          <div>
            <T component="order" name="anErrorOccuredHelpText" />
          </div>
        </div>
      );
    } else {
      orderStatus = (
        <div>
          <span
            style={{
              background: '#090',
              display: 'inline-block',
              textAlign: 'center',
              color: '#fcfcfc',
              width: 25,
              height: 25,
              borderRadius: 20,
              fontSize: 20
            }}
          >
            ✓
          </span>
          <div data-cy="order-status">
            <T
              component="order"
              name="booksOrdered"
              vars={[
                orderSuccess > 1 ? T({component: 'general', name: 'all'}) : '',
                bookOrBooks
              ]}
            />
          </div>
          {orderSuccess > 0 && (
            <div>
              <T component="order" name="booksOrderedText" />
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <Modal
      className="add-to-list--modal"
      header={<T component="order" name="modalTitle" />}
      onClose={props.onClose}
      onDone={onDone}
      doneText={doneText}
    >
      <div>
        <div className="form-group">
          <strong>
            <T
              component="order"
              name="modalTextCount"
              vars={[props.orders.length, bookOrBooks]}
            />
          </strong>
          {props.orders.length >= 10 && (
            <small className="d-block">
              <T component="order" name="modalOrderLimit" />
            </small>
          )}
          {unavailableCount > 0 && (
            <small className="d-block" style={{color: 'red'}}>
              <T component="order" name="modalOrderNotice" />
            </small>
          )}
          <div
            style={{
              marginTop: 10,
              background: 'white',
              scroll: 'auto',
              maxHeight: 250,
              overflowY: 'scroll',
              overflowX: 'hidden'
            }}
          >
            {props.orders.map(book => {
              return (
                <div className="row short-list-page" key={book.pid}>
                  <div
                    className="col-12"
                    style={{
                      paddingBottom: 5,
                      paddingTop: 5,
                      borderTop: '1px solid #ccc'
                    }}
                  >
                    <span style={{height: 60, float: 'left', marginRight: 10}}>
                      <BookCover book={book} style={{width: 'unset'}} />
                    </span>
                    <div
                      style={{
                        display: 'inline-block',
                        height: 60,
                        float: 'right',
                        marginRight: 10
                      }}
                    >
                      <small className="d-block">
                        <OrderState book={book} />
                      </small>
                    </div>
                    <div className="title">{book.title}</div>
                    <div className="creator">{book.creator}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {reviewingOrder ? (
          <div className="form-group" style={{marginBottom: 0}}>
            <label htmlFor="pickupBranch">
              <T component="order" name="orderPickup" />
            </label>
            <select
              className="form-control"
              id="pickupBranch"
              style={{width: 'auto'}}
              onChange={props.onChangeBranch}
              value={props.currentBranch}
            >
              {props.branches.map(branch => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName[0]}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div style={{textAlign: 'center'}}>{orderStatus}</div>
        )}
      </div>
    </Modal>
  );
}
export function mapStateToProps(state) {
  return {
    orders: Object.values(state.orderReducer.orders).filter(
      book => book.ordering
    ),
    branches: state.orderReducer.pickupBranches,
    currentBranch: state.orderReducer.currentBranch
  };
}
export function mapDispatchToProps(dispatch) {
  return {
    onChangeBranch: o => {
      dispatch({type: SET_CURRENT_BRANCH, branch: o.target.value});
    },
    onStart: (books, branch) => {
      for (const book of books) {
        dispatch({type: ORDER_START, pid: book.pid, branch});
      }
    },
    onClose: () => {
      dispatch({type: ORDER_DONE});
      dispatch({type: CLOSE_MODAL, modal: 'order'});
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderModal);
