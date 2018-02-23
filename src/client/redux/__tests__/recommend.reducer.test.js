import recommendReducer, {
  RECOMMEND_REQUEST,
  RECOMMEND_RESPONSE,
  getRecommendations
} from '../recommend.reducer';

describe('recommendReducer', () => {
  test('request with tags only', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_REQUEST,
      tags: [2, 1, 4]
    });
    expect(getRecommendations(state, {tags: [2, 1, 4]})).toMatchSnapshot();
  });
  test('request with creators only', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_REQUEST,
      creators: ['ib', 'arne']
    });
    expect(
      getRecommendations(state, {creators: ['ib', 'arne']})
    ).toMatchSnapshot();
  });
  test('request with creators and tags', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_REQUEST,
      tags: [2, 1, 4],
      creators: ['ib', 'arne']
    });
    expect(
      getRecommendations(state, {tags: [2, 1, 4], creators: ['ib', 'arne']})
    ).toMatchSnapshot();
  });
  test('response', () => {
    const state = recommendReducer(undefined, {
      type: RECOMMEND_RESPONSE,
      tags: [2, 1, 4],
      creators: ['ib', 'arne'],
      pids: ['pid1', 'pid2', 'pid3']
    });
    expect(
      getRecommendations(state, {tags: [2, 1, 4], creators: ['ib', 'arne']})
    ).toMatchSnapshot();
  });
});
