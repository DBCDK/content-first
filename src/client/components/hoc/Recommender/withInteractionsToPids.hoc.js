import React from 'react';
import {connect} from 'react-redux';
import withPidsToPids from './withPidsToPids.hoc';

/**
 * A HOC that makes the enhanced component download recommendations using
 * the recent interactions from the logged in user.
 *
 * @param {React.Component} WrappedComponent The component to be enhanced
 * @returns {React.Component} The enhanced component
 *
 * @example
 * // create a pure component and enhance it
 * const GreatRecommendations = ({recommendations}) =>
 *  <ul>{recommendations.map(pid => <li>{pid}</li>)}</ul>;
 * export default withInteractionsToPids(GreatRecommendations)
 *
 * // use the enhanced component like this
 * <GreatRecommendations />
 *
 * // the recommendations may be lazy-loaded using the isVisible prop.
 * // if isVisible=false, recommendations are not downloaded until isVisible=true
 * <GreatRecommendations isVisible={false}/>
 */
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
