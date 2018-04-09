import React from 'react';
import {connect} from 'react-redux';
import {ORDER} from '../../redux/order.reducer.js';

export function OrderButton(props) {
  const [buttonClass, buttonLabel] = {
    'not ordered': ['btn-primary', 'Bestil'],
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
    <button
      className={`btn ${buttonClass} ${props.className}`}
      style={props.style}
      onClick={props.order}
    >
      {buttonLabel}
    </button>
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
export default connect(mapStateToProps, mapDispatchToProps)(OrderButton);
