import React from 'react';
import {connect} from 'react-redux';
import Spinner from '../general/Spinner.component';
import Modal from './Modal.component';
import BookCover from '../general/BookCover.component';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import {
  SET_CURRENT_BRANCH,
  ORDER_START,
  ORDER_DONE
} from '../../redux/order.reducer';

export function OrderState({book}) {
  if (book.get('orderState') === 'ordered') {
    return <span style={{color: 'green'}}>Er bestilt.</span>;
  }
  if (book.get('orderState') === 'error') {
    return (
      <span style={{color: 'red'}}>
        Fejl ved <br /> bestilling.
      </span>
    );
  }
  if (book.get('orderState') === 'ordering') {
    return (
      <span>
        <Spinner size={12} style={{marginTop: 5, marginLeft: 18}} />
        <br />
        Bestiller
      </span>
    );
  }
  if (!book.get('availability')) {
    return (
      <span style={{textAlign: 'center', display: 'inline-block'}}>
        <Spinner size={12} style={{marginTop: 5}} />
        <br />
        Checker <br /> tilgængelighed
      </span>
    );
  }
  if (book.getIn(['availability', 'holdingStatus', 'willLend']) === false) {
    return (
      <span style={{color: 'red'}}>
        Kan ikke bestilles<br />til dit bibliotek.
      </span>
    );
  }
  return '';
}

function orderInfo({orders, onStart}) {
  let orderError = 0;
  let orderSuccess = 0;
  let orderable = [];
  let reviewingOrder = false;
  let ordering = false;
  let doneText, onDone;
  let orderStatus = '';
  let unavailableCount = 0;

  for (const o of orders) {
    const state = o.get('orderState');
    const unavailable =
      o.getIn(['availability', 'holdingStatus', 'willLend']) === false;
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
      doneText = 'JA TAK, BESTIL NU';
      onDone = () => onStart(orderable);
      reviewingOrder = true;
    }
    if (state === 'error') {
      ++orderError;
    }
    if (state === 'ordering') {
      ordering = true;
      doneText = 'BESTILLER...';
      onDone = () => {};
      orderStatus = (
        <span>
          <Spinner size={32} style={{margin: 8}} />
          <br />
          Bestiller...
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
          <div style={{color: 'red'}}>
            Der skete en fejl så {orderError} af bøgerne ikke er blevet bestilt.
          </div>
          <div>Du kan evt. prøve at bestille bøgerne igen</div>
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
          <div>
            {orderSuccess > 2 ? 'Alle' : ''} {orderSuccess}{' '}
            {orderSuccess === 1 ? 'bog' : 'bøger'} er bestilt.
          </div>
          {orderSuccess > 0 && (
            <div>
              Du får besked fra dit bibliotek, når de er klar til afhentning
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <Modal
      className="add-to-list--modal"
      header={'BESTIL'}
      onClose={props.onClose}
      onDone={onDone}
      doneText={doneText}
    >
      <div>
        <div className="form-group">
          <p style={{background: '#f66', textAlign: 'center'}}>
            <strong>
              <small>
                Demo af bestil-UI, backend mangler, så bestillingerne går ikke
                igennem endnu.
              </small>
            </strong>
          </p>
          <strong>
            Du er ved at bestille{props.orders.size > 1 &&
              ` ${props.orders.size} bøger`}:
          </strong>
          {unavailableCount > 0 && (
            <small style={{color: 'red'}}>
              <br />Bemærk: Der er problemer med bestillingen af mindst en af
              bøgerne.
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
                    <div
                      style={{
                        display: 'inline-block',
                        height: 60,
                        float: 'right',
                        marginRight: 10
                      }}
                    >
                      <small>
                        <OrderState book={book} />
                      </small>
                    </div>
                    <div className="title">{book.get('title')}</div>
                    <div className="creator">{book.get('creator')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {reviewingOrder ? (
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
                <option
                  key={branch.get('branchId')}
                  value={branch.get('branchId')}
                >
                  {branch.getIn(['branchName', 0])}
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
    orders: state.orderReducer
      .get('orders')
      .valueSeq()
      .filter(book => book.get('ordering')),
    branches: state.orderReducer.get('pickupBranches'),
    currentBranch: state.orderReducer.get('currentBranch')
  };
}
export function mapDispatchToProps(dispatch) {
  return {
    onChangeBranch: o => {
      dispatch({type: SET_CURRENT_BRANCH, branch: o.target.value});
    },
    onStart: books => {
      for (const book of books) {
        dispatch({type: ORDER_START, pid: book.get('pid')});
      }
    },
    onClose: () => {
      dispatch({type: ORDER_DONE});
      dispatch({type: CLOSE_MODAL, modal: 'order'});
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderModal);
