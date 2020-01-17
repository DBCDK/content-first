import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import {fetchWorkRecommendations} from '../../../redux/recommend.thunk';

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
export default WrappedComponent => props => {
  const {likes, dislikes, tag_weight, limit, excluded} = props;
  const kiosk = useSelector(store => store.kiosk);
  const agencyId = get(kiosk, 'configuration.agencyId');
  const branch = get(kiosk, 'configuration.branch');
  const requestKey = JSON.stringify({
    likes,
    dislikes,
    tag_weight,
    limit,
    excluded,
    agencyId,
    branch
  });
  const recommendations = useSelector(
    store =>
      store.recommendReducer.recommendations[requestKey] || {
        pids: []
      }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // if (!isVisible) {
    //   return;
    // }
    if (kiosk.enabled && (!agencyId || !branch)) {
      return;
    }
    dispatch(
      fetchWorkRecommendations({
        requestKey,
        likes,
        dislikes,
        tag_weight,
        agencyId,
        branch,
        limit
      })
    );

    // }
  }, [requestKey]);

  return (
    <WrappedComponent
      {...props}
      recommendations={recommendations.pids}
      rid={recommendations.rid}
    />
  );
};
