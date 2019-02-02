import React from 'react';
import {connect} from 'react-redux';
import {createGetIdsFromRange} from '../../../redux/selectors';
import {
  TAGS_RECOMMEND_REQUEST,
  createGetRecommendedPids
} from '../../../redux/recommend';

const withTagsToPids = WrappedComponent => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      this.fetch();
    }
    fetch() {
      if (
        this.props.isVisible &&
        this.fetched !== this.props.plainSelectedTagIds
      ) {
        this.fetched = this.props.plainSelectedTagIds;
        this.props.fetchRecommendations(this.props.plainSelectedTagIds);
      }
    }

    render() {
      // console.log('ima rendering', this.props);
      return <WrappedComponent {...this.props} />;
    }
  };

  const makeMapStateToProps = () => {
    const getIdsFromRange = createGetIdsFromRange();
    const getRecommendedPids = createGetRecommendedPids();
    return (state, ownProps) => {
      const plainSelectedTagIds = getIdsFromRange(state, {
        tags: ownProps.tags
      });
      let {pids, rid} = getRecommendedPids(state, {
        tags: plainSelectedTagIds,
        excluded: ownProps.excluded
      });
      return {
        plainSelectedTagIds,
        recommendations: pids,
        rid
      };
    };
  };

  const mapDispatchToProps = dispatch => ({
    fetchRecommendations: tags =>
      dispatch({
        type: TAGS_RECOMMEND_REQUEST,
        fetchWorks: false,
        tags: tags,
        max: 50
      })
  });
  return connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withTagsToPids;
