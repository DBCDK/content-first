import React from 'react';
import {connect} from 'react-redux';
import {ORDER} from '../../redux/order.reducer.js';
import _ from 'lodash';

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
  orderState:
    _.get(state, ['orderReducer', ownProps.pid, 'state']) || 'not ordered'
});
export const mapDispatchToProps = (dispatch, ownProps) => ({
  order: () => dispatch({type: ORDER, pid: ownProps.pid})
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderButton);
