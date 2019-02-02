import React from 'react';
import {connect} from 'react-redux';
import withPidsToPids from './withPidsToPids.hoc';

const withInteractionsToPids = WrappedComponent => {
  WrappedComponent = withPidsToPids(WrappedComponent);
  const Wrapper = class extends React.Component {
    getRecoPids() {
      return this.props.interactions.map(o => {
        return o.pid;
      });
    }

    render() {
      return <WrappedComponent {...this.props} likes={this.getRecoPids()} />;
    }
  };

  const mapStateToProps = state => ({
    interactions: state.interactionReducer.interactions
  });

  return connect(mapStateToProps)(Wrapper);
};

export default withInteractionsToPids;
