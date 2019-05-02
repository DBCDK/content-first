import React from 'react';
import {connect} from 'react-redux';
import Button from '../base/Button';
import Icon from '../base/Icon';
import T from '../base/T';
import Spinner from '../general/Spinner/Spinner.component';
import {collectionContainsBook} from '../work/workFunctions';
import {ORDER} from '../../redux/order.reducer.js';

import './orderButton.css';

export function OrderButton(props) {
  const [buttonClass, buttonLabel] = {
    'not ordered': [
      '',
      <React.Fragment>
        <Icon name={props.icon} />
        {props.children || props.label}
      </React.Fragment>
    ],
    ordered: ['success', <T component="order" name="orderDone" />],
    ordering: [
      'progress',
      <span>
        <Spinner className="mr-1" size={14} color={'var(--petroleum)'} />
        <T component="order" name="orderInProgress" />
      </span>
    ],
    error: ['error', <T component="order" name="orderError" />]
  }[props.orderState];

  // If physical book does NOT exist in the work collection
  if (!collectionContainsBook(props)) {
    return null;
  }

  return (
    <Button
      className={`orderButton ${buttonClass} ${props.className}`}
      type={props.type}
      size={props.size}
      iconLeft={props.iconLeft}
      iconRight={props.iconRight}
      onClick={props.order}
      dataCy="order-btn"
    >
      {buttonLabel}
    </Button>
  );
}

export const mapStateToProps = (state, ownProps) => ({
  className: ownProps.className || '',
  style: ownProps.style,
  orderState:
    (state.orderReducer.orders[ownProps.book.pid] &&
      state.orderReducer.orders[ownProps.book.pid].orderState) ||
    'not ordered'
});

export const mapDispatchToProps = (dispatch, ownProps) => ({
  order: () => {
    dispatch({type: ORDER, book: ownProps.book});
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderButton);
