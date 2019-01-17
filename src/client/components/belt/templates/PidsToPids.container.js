import React from 'react';
import {connect} from 'react-redux';
import {difference} from 'lodash';
import BooksBelt from './BooksBelt.container';
import {
  WORK_RECOMMEND_REQUEST,
  getWorkRecommendedPids
} from '../../../redux/recommend';

export class PidsToPids extends React.Component {
  componentDidMount() {
    if (this.props.likes.length > 0) {
      this.getRecommendations(this.props.likes);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.likes !== nextProps.likes) {
      this.getRecommendations(nextProps.likes);
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.likes !== this.props.likes ||
      nextProps.recommendations !== this.props.recommendations
    );
  }

  getRecommendations = likes => {
    this.props.fetchRecommendations(likes);
  };

  render() {
    return (
      <BooksBelt
        {...this.props}
        recommendations={this.props.recommendations}
        showTags={false}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const excluded = ownProps.excluded || [];
  const recommendations = difference(
    getWorkRecommendedPids(state.recommendReducer, {
      likes: ownProps.likes
    }).pids,
    excluded
  ).slice(0, 20);

  return {
    recommendations
  };
};

export const mapDispatchToProps = dispatch => ({
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PidsToPids);
