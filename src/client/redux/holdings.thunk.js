import request from 'superagent';
import {
  FETCH_HOLDINGS,
  FETCH_HOLDINGS_SUCCESS,
  FETCH_HOLDINGS_ERROR
} from './holdings.reducer';

const fetchHoldingsFromEndpoint = async (agencyId, branch, pid) =>
  (await request.get('/v1/holdings').query({pid, agencyId, branch})).body;

const ONE_MINUTE = 60 * 1000;
const holdingsExpired = timestamp =>
  new Date().getTime() - timestamp > ONE_MINUTE;

export const fetchHoldings = (agencyId, branch, pid) => async (
  dispatch,
  getState
) => {
  try {
    const {holdings} = getState();
    if (!holdings[pid] || holdingsExpired(holdings[pid].timestamp)) {
      dispatch({type: FETCH_HOLDINGS, pid});
      const holdingsData = await fetchHoldingsFromEndpoint(
        agencyId,
        branch,
        pid
      );
      dispatch({
        type: FETCH_HOLDINGS_SUCCESS,
        pid,
        holdings: holdingsData[pid]
      });
    }
  } catch (e) {
    dispatch({
      type: FETCH_HOLDINGS_ERROR,
      pid: pid,
      error: e
    });
  }
};
