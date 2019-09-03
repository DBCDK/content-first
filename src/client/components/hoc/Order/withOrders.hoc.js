import React from 'react';
import {connect} from 'react-redux';

export const withOrders = WrappedComponent => {
  const Wrapper = class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = state => {
    return {
      orders: state.orderReducer.orders
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
