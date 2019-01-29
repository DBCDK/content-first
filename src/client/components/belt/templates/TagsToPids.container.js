import React from 'react';
import {connect} from 'react-redux';
import {difference} from 'lodash';
import BooksBelt from './BooksBelt.container';
import {getIdsFromRange} from '../../../redux/selectors';
import {
  TAGS_RECOMMEND_REQUEST,
  getRecommendedPids
} from '../../../redux/recommend';

export class TagsToPids extends React.Component {
  componentDidMount() {
    this.fetchRecommendations();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.tags !== this.props.tags ||
      nextProps.recommendations !== this.props.recommendations
    );
  }

  fetchRecommendations = () => {
    this.props.fetchRecommendations();
  };

  render() {
    return (
      <BooksBelt
        {...this.props}
        recommendations={this.props.recommendations}
        showTags={true}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const excluded = ownProps.excluded || [];
  const plainSelectedTagIds = getIdsFromRange(state, ownProps.tags);
  let {pids, rid} = getRecommendedPids(state.recommendReducer, {
    tags: plainSelectedTagIds
  });
  pids = difference(pids, excluded).slice(0, 20);

  return {
    recommendations: pids,
    rid
  };
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchRecommendations: () =>
    dispatch({
      type: TAGS_RECOMMEND_REQUEST,
      fetchWorks: false,
      tags: ownProps.tags,
      max: 50
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsToPids);
