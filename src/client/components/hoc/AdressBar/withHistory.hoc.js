import React from 'react';
import {connect} from 'react-redux';
import {
  HISTORY_PUSH,
  HISTORY_PUSH_FORCE_REFRESH,
  HISTORY_REPLACE
} from '../../../redux/middleware';

/**
 * A HOC that enhance the wrapped component with a number of reducers
 * with which the History can be accessed
 *
 * @param {React.Component} WrappedComponent The component to be enhanced
 * @returns {React.Component} The enhanced component
 *
 */
const withHistory = WrappedComponent => {
  const Wrapped = class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = () => ({});

  const mapDispatchToProps = dispatch => ({
    historyPush: (path, params) => {
      dispatch({
        type: HISTORY_PUSH,
        path: path,
        params: params
      });
    },

    historyPushForceRefresh: (path, params) => {
      dispatch({
        type: HISTORY_PUSH_FORCE_REFRESH,
        path: path,
        params: params
      });
    },

    historyReplace: (path, params) => {
      dispatch({
        type: HISTORY_REPLACE,
        path: path,
        params: params
      });
    }
  });
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};
export default withHistory;
