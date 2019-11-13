import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {fetchHoldings} from '../../../redux/holdings.thunk';

/**
 *
 * withHoldings
 *
 * @param {object} pid - The pid for the material to fetch Holdings for
 * @return {object} - returns the Holdings
 **/

export const withHoldings = WrappedComponent => props => {
  const {pid} = props;
  const [hasDispatched, setHasDispatched] = useState(false);
  const {holdings} = useSelector(store => store.holdings, shallowEqual);
  const dispatch = useDispatch();

  const agencyId = '737600';
  const branch = 'Hovedbiblioteket';

  useEffect(() => {
    if (!hasDispatched) {
      dispatch(fetchHoldings(agencyId, branch, pid));
      setHasDispatched(true);
    }
  });

  return <WrappedComponent {...props} holdings={holdings[pid]} />;
};

export default withHoldings;
