import React from 'react';
import {connect} from 'react-redux';
import Spinner from '../general/Spinner/Spinner.component';
import Modal from './Modal/Modal.component';
import BookCover from '../general/BookCover/BookCover.component';
import T from '../base/T';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {
  SET_CURRENT_BRANCH,
  ORDER_START,
  ORDER_DONE
} from '../../redux/order.reducer';

import './OrderModal.css';

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

function orderInfo({orders, onStart, currentBranch, branches, branchesLoaded}) {
  let orderError = 0;
  let orderSuccess = 0;
  let orderable = [];
  let reviewingOrder = false;
  let ordering = false;
  let doneText, onDone;
  let orderStatus = '';
  let unavailableCount = 0;
  const orderPossible =
    orders &&
    orders.filter(
      book => book && book.availability && book.availability.orderPossible
    ).length > 0;
  let doneDisabled = !branchesLoaded || !orderPossible;

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
    ordering,
    doneDisabled
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
    reviewingOrder,
    doneDisabled
  } = orderInfo(props);
  const {branchesLoaded} = props;

  const bookOrBooks = count =>
    T({
      component: 'general',
      name: count === 1 ? 'book' : 'books'
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
            role="img"
            aria-label=""
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
                orderSuccess > 1 ? orderSuccess : '1',
                bookOrBooks(orderSuccess)
              ]}
            />
          </div>
          {orderSuccess > 0 && (
            <div>
              <T
                component="order"
                name="booksOrderedText"
                vars={[props.orders.length > 1 ? 'de' : 'den']}
              />
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
      doneDisabled={doneDisabled}
    >
      <div className="order-elements--wrap">
        <div className="form-group">
          <strong>
            <T
              component="order"
              name="modalTextCount"
              vars={[props.orders.length, bookOrBooks(props.orders.length)]}
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
          <div className="order-elements--container">
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
                    <span style={{width: 40, float: 'left', marginRight: 10}}>
                      <BookCover pid={book.pid} />
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
            <div className="d-flex align-items-center">
              <select
                className="form-control"
                id="pickupBranch"
                style={{width: branchesLoaded ? 'auto' : 150}}
                onChange={props.onChangeBranch}
                value={props.currentBranch}
              >
                {props.branches.map(branch => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.branchName[0]}
                  </option>
                ))}
              </select>
              {!branchesLoaded && <Spinner className="ml-2" size={24} />}
            </div>
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
    currentBranch: state.orderReducer.currentBranch,
    branchesLoaded:
      (state.orderReducer.pickupBranches &&
        state.orderReducer.pickupBranches.length > 0) ||
      false
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
