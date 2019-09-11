import React from 'react';
import {connect} from 'react-redux';
import {
  WORK_RECOMMEND_REQUEST,
  createWorkRecommendedPids
} from '../../../redux/recommend';

/**
 * A HOC that makes the enhanced component take a list of likes (pids) as
 * input prop, download the corresponding recommendations, and then map them
 * as a prop.
 *
 * @param {React.Component} WrappedComponent The component to be enhanced
 * @returns {React.Component} The enhanced component
 *
 * @example
 * // create a pure component and enhance it
 * const GreatRecommendations = ({recommendations}) =>
 *  <ul>{recommendations.map(pid => <li>{pid}</li>)}</ul>;
 * export default withPidsToPids(GreatRecommendations)
 *
 * // use the enhanced component like this
 * <GreatRecommendations likes={['870970-basis:123456', '870970-basis:456789']}/>
 *
 * // the recommendations may be lazy-loaded using the isVisible prop.
 * // if isVisible=false, recommendations are not downloaded until isVisible=true
 * <GreatRecommendations likes={['870970-basis:123456']} isVisible={false}/>
 */
const withPidsToPids = WrappedComponent => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      this.fetch();
    }
    fetch() {
      if (
        (this.props.isVisible || typeof this.props.isVisible === 'undefined') &&
        this.props.likes &&
        this.props.likes.length > 0 &&
        this.fetched !== this.props.likes
      ) {
        this.fetched = this.props.likes;

        this.props.fetchRecommendations(
          this.props.likes,
          this.props.dislikes,
          this.props.tag_weight
        );
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const makeMapStateToProps = () => {
    const getWorkRecommendedPids = createWorkRecommendedPids();
    return (state, ownProps) => {
      let {pids, rid} = getWorkRecommendedPids(state, {
        likes: ownProps.likes,
        excluded: ownProps.excluded
      });
      return {
        recommendations: pids,
        rid,
        recommendationsLoaded: !!rid
      };
    };
  };

  const mapDispatchToProps = dispatch => ({
    fetchRecommendations: (likes, dislikes = [], tag_weight) => {
      dispatch({
        type: WORK_RECOMMEND_REQUEST,
        fetchWorks: false,
        likes,
        dislikes,
        limit: 50,
        tag_weight
      });
    }
  });
  return connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withPidsToPids;
