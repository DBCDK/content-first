import React from 'react';
import {connect} from 'react-redux';
import {
  WORK_RECOMMEND_REQUEST,
  createWorkRecommendedPids
} from '../../../redux/recommend';

const withPidsToPids = WrappedComponent => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      this.fetch();
    }
    fetch() {
      if (this.props.isVisible && this.fetched !== this.props.likes) {
        this.fetched = this.props.likes;
        this.props.fetchRecommendations(this.props.likes);
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
        rid
      };
    };
  };

  const mapDispatchToProps = dispatch => ({
    fetchRecommendations: (likes, dislikes = []) => {
      dispatch({
        type: WORK_RECOMMEND_REQUEST,
        fetchWorks: false,
        likes,
        dislikes,
        limit: 50
      });
    }
  });
  return connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withPidsToPids;
