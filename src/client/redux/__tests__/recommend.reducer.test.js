import recommendReducer, {
  RECOMMEND_REQUEST,
  RECOMMEND_RESPONSE
} from '../recommend.reducer';

describe('recommendReducer', () => {
  test('normalized key is used for request, tags only', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_REQUEST,
      tags: [2, 1, 4]
    });
    expect(state).toMatchSnapshot();
  });
  test('normalized key is used for request, creators only', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_REQUEST,
      creators: ['ib', 'arne']
    });
    expect(state).toMatchSnapshot();
  });
  test('normalized key is used for request, tags and creators', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_REQUEST,
      tags: [2, 1, 4],
      creators: ['ib', 'arne']
    });
    expect(state).toMatchSnapshot();
  });
  test('normalized key is used for response', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_RESPONSE,
      tags: [2, 1, 4],
      creators: ['ib', 'arne'],
      pids: ['pid1', 'pid2', 'pid3']
    });
    expect(state).toMatchSnapshot();
  });
});
