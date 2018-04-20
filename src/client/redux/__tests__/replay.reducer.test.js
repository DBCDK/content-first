import {replayReducer} from '../replay';
import {ORDER} from '../order.reducer';
import {ON_LOCATION_CHANGE} from '../router.reducer';

const createTestState = () => ({
  expanded: false,
  elements: [],
  isLoading: false,
  pendingMerge: null
});

const initState = {
  isReplaying: false,
  actions: []
};

describe('replayReducer', () => {
  test('Allowed actions are recorded', () => {
    let resState = replayReducer(initState, {
      type: ON_LOCATION_CHANGE,
      location: {search: '?param=val'}
    });
    resState = replayReducer(resState, {type: ORDER, somekey: 1});
    resState = replayReducer(resState, {type: ORDER, somekey: 2});
    expect(resState).toMatchSnapshot();
  });
  test('Actions are not recorded if they are not allowed', () => {
    let resState = replayReducer(initState, {type: 'NOT_ALLOWED'});
    expect(resState).toMatchSnapshot();
  });
  test('ON_LOCATION_CHANGE replaces existing action of this type', () => {
    let resState = replayReducer(initState, {
      type: ON_LOCATION_CHANGE,
      location: {search: '?param=val'}
    });
    resState = replayReducer(initState, {
      type: ON_LOCATION_CHANGE,
      location: {search: '?param=val2'}
    });
    expect(resState).toMatchSnapshot();
  });
  test('ON_LOCATION_CHANGE clears actions', () => {
    let resState = replayReducer(initState, {
      type: ON_LOCATION_CHANGE,
      location: {search: '?param=val'}
    });
    resState = replayReducer(resState, {type: ORDER, somekey: 1});
    resState = replayReducer(resState, {type: ORDER, somekey: 2});
    resState = replayReducer(initState, {
      type: ON_LOCATION_CHANGE,
      location: {search: '?param=val2'}
    });
    expect(resState).toMatchSnapshot();
  });
});
