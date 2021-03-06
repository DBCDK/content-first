import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchHoldings} from '../../../redux/holdings.thunk';

/**
 *
 * withHoldings
 *
 * @param {object} pid - The pid for the material to fetch Holdings for
 * @return {object} - returns the Holdings
 **/
export const withHoldings = WrappedComponent => props => {
  const {agencyId, branch, pid} = props;
  const [hasDispatched, setHasDispatched] = useState(false);
  const holdings = useSelector(store => store.holdings[pid]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (agencyId && branch && !hasDispatched) {
      dispatch(fetchHoldings(agencyId, branch, pid));
      setHasDispatched(true);
    }
  }, [agencyId, branch, pid, dispatch, hasDispatched]);

  return <WrappedComponent pid={pid} holdings={holdings} />;
};

export default withHoldings;
