import React from 'react';
import {connect} from 'react-redux';
import Button from '../base/Button';
import Icon from '../base/Icon';
import {ORDER} from '../../redux/order.reducer.js';

export function OrderButton(props) {
  const [buttonClass, buttonLabel] = {
    'not ordered': [
      '',
      <React.Fragment>
        <Icon name={props.icon} />
        {props.label}
      </React.Fragment>
    ],
    ordered: ['btn-success', 'Bestilt'],
    ordering: [
      'btn-info',
      <span>
        <span
          className="spinner"
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            marginRight: 5
          }}
        />
        Bestiller...
      </span>
    ],
    error: ['btn-danger', 'Fejl ved bestilling']
  }[props.orderState];
  return (
    <Button
      className={`${buttonClass} ${props.className}`}
      type={props.type}
      size={props.size}
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
  orderState: state.orderReducer.getIn(
    ['orders', ownProps.book.pid, 'orderState'],
    'not ordered'
  )
});

export const mapDispatchToProps = (dispatch, ownProps) => ({
  order: () => dispatch({type: ORDER, book: ownProps.book})
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderButton);
