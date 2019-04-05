import React from 'react';
import {connect} from 'react-redux';
import {createGetIdsFromRange} from '../../../redux/selectors';
import {
  TAGS_RECOMMEND_REQUEST,
  createGetRecommendedPids
} from '../../../redux/recommend';

/**
 * A HOC that makes the enhanced component take a list of tags as input prop,
 * download the corresponding recommendations, and then map them as a prop.
 *
 * @param {React.Component} WrappedComponent The component to be enhanced
 * @returns {React.Component} The enhanced component
 *
 * @example
 * // create a pure component and enhance it
 * const GreatRecommendations = ({recommendations}) =>
 *  <ul>{recommendations.map(pid => <li>{pid}</li>)}</ul>;
 * export default withTagsToPids(GreatRecommendations)
 *
 * // use the enhanced component like this
 * <GreatRecommendations tags={[123, 234]}/>
 *
 * // the recommendations may be lazy-loaded using the isVisible prop.
 * // if isVisible=false, recommendations are not downloaded until isVisible=true
 * <GreatRecommendations tags={[123, 234]} isVisible={false}/>
 */
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
        (this.props.isVisible || typeof this.props.isVisible === 'undefined') &&
        this.fetched !== this.props.plainSelectedTagIds
      ) {
        this.fetched = this.props.plainSelectedTagIds;
        this.props.fetchRecommendations(this.props.plainSelectedTagIds);
      }
    }

    render() {
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
        excluded: ownProps.excluded,
        limit: ownProps.limit
      });
      return {
        plainSelectedTagIds,
        recommendations: pids,
        rid
      };
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchRecommendations: tags =>
      dispatch({
        type: TAGS_RECOMMEND_REQUEST,
        fetchWorks: false,
        tags: tags,
        max: Math.max(50, (ownProps.limit || 0) * 2)
      })
  });
  return connect(
    makeMapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withTagsToPids;
