import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import {filtersMapAll} from '../../../redux/filter.reducer';
import {fetchTagRecommendations} from '../../../redux/recommend.thunk';

const getIdsFromRange = (filterCards, tags = []) => {
  let plainSelectedTagIds = [];
  tags.forEach(id => {
    if (id instanceof Array) {
      const parent = filtersMapAll[id[0]].parents[0];
      const range = filterCards[parent].range;

      const min = range.indexOf(id[0]);
      const max = range.indexOf(id[1]);

      range.forEach((aId, idx) => {
        if (idx >= min && idx <= max) {
          plainSelectedTagIds.push(aId);
        }
      });
    } else {
      plainSelectedTagIds.push(id);
    }
  });
  return plainSelectedTagIds;
};

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
 *
 * // One may filter on a specific branch
 * <GreatRecommendations tags={[123, 234]} branch="Hovedbiblioteket" agencyId="710100"/>
 */
export default WrappedComponent => props => {
  const {tags, limit, threshold, excluded, plus, minus} = props;
  const kiosk = useSelector(store => store.kiosk);
  const agencyId = get(kiosk, 'configuration.agencyId');
  const branch = get(kiosk, 'configuration.branch');
  const requestKey = JSON.stringify({
    tags,
    limit,
    threshold,
    excluded,
    agencyId,
    branch,
    plus,
    minus
  });

  const recommendations = useSelector(
    store =>
      store.recommendReducer.recommendations[requestKey] || {
        pids: []
      }
  );
  const filterCards = useSelector(store => store.filtercardReducer);

  const plainSelectedTagIds = getIdsFromRange(filterCards, tags);
  const dispatch = useDispatch();
  useEffect(() => {
    // if (!isVisible) {
    //   return;
    // }
    if (kiosk.enabled && (!agencyId || !branch)) {
      return;
    }
    dispatch(
      fetchTagRecommendations({
        requestKey,
        tags,
        agencyId,
        branch,
        limit,
        plus,
        minus
      })
    );

    // }
  }, [requestKey]);

  return (
    <WrappedComponent
      {...props}
      recommendations={recommendations.pids}
      isLoading={recommendations.isLoading}
      hasLoaded={recommendations.hasLoaded}
      plainSelectedTagIds={plainSelectedTagIds}
      rid={recommendations.rid}
    />
  );
};
