import React from 'react';
import {connect} from 'react-redux';

export const withInteractions = WrappedComponent => {
  const Wrapper = class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = state => {
    return {
      interactions: state.interactionReducer.interactions
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
