import request from 'superagent';
import {
  FETCH_HOLDINGS,
  FETCH_HOLDINGS_SUCCESS,
  FETCH_HOLDINGS_ERROR
} from './holdings.reducer';
import {throttle} from 'lodash';

const fetchHoldingsFromEndpoint = async (agencyId, branch, pid) =>
  (await request.get('/v1/holdings').query({pid, agencyId, branch})).body;

const ONE_MINUTE = 60 * 1000;
const holdingsExpired = timestamp =>
  new Date().getTime() - timestamp > ONE_MINUTE;

let pidQueue = [];
const throttledFetchHoldings = throttle(
  async (agencyId, branch, dispatch) => {
    const pids = [...pidQueue];
    pidQueue = [];
    try {
      dispatch({type: FETCH_HOLDINGS, pids});
      const holdings = await fetchHoldingsFromEndpoint(agencyId, branch, pids);
      dispatch({
        type: FETCH_HOLDINGS_SUCCESS,
        holdings
      });
    } catch (e) {
      dispatch({
        type: FETCH_HOLDINGS_ERROR,
        pids: pids,
        error: e
      });
    }
  },
  500,
  {leading: true}
);

/**
 * Will fetch holdings for a given pid on a given branch.
 * Lodash's throttle is used to reduce the number of
 * HTTP requests, and should improve performance.
 *
 * @param {string} agencyId
 * @param {string} branch
 * @param {string} pid
 */
export const fetchHoldings = (agencyId, branch, pid) => async (
  dispatch,
  getState
) => {
  const {holdings} = getState();
  if (!holdings[pid] || holdingsExpired(holdings[pid].timestamp)) {
    pidQueue = [...pidQueue, pid];
    throttledFetchHoldings(agencyId, branch, dispatch, getState);
  }
};
