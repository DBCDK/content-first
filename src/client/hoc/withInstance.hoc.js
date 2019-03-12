import React from 'react';
import {connect} from 'react-redux';
import {STORE_INSTANCE} from '../../../redux/instance.reducer';

const withInstance = WrappedComponent => {
  const Wrapped = class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
  const mapStateToProps = (state, ownProps) => {
    return {
      instance: state.instance[ownProps.key]
    };
  };
  const mapDispatchToProps = dispatch => ({
    storeInstance: data => dispatch({type: STORE_INSTANCE, data})
  });
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withInstance;
