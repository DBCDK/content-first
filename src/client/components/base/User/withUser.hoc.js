import React from 'react';
import {connect} from 'react-redux';

const withUser = WrappedComponent => {
  const Wrapper = class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = state => ({
    user: state.userReducer
  });

  return connect(mapStateToProps)(Wrapper);
};

export default withUser;
