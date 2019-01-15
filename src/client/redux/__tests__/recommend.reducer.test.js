import recommendReducer, {
  TAGS_RECOMMEND_REQUEST,
  TAGS_RECOMMEND_RESPONSE,
  getRecommendedPids
} from '../recommend';

describe('recommendReducer', () => {
  test('request with tags only', () => {
    const state = recommendReducer(
      {
        recommendations: {}
      },
      {
        type: TAGS_RECOMMEND_REQUEST,
        tags: [2, 1, 4]
      }
    );
    expect(getRecommendedPids(state, {tags: [2, 1, 4]})).toMatchSnapshot();
  });
  test('request with creators only', () => {
    const state = recommendReducer(
      {
        recommendations: {}
      },
      {
        type: TAGS_RECOMMEND_REQUEST,
        creators: ['ib', 'arne']
      }
    );
    expect(
      getRecommendedPids(state, {creators: ['ib', 'arne']})
    ).toMatchSnapshot();
  });
  test('request with creators and tags', () => {
    const state = recommendReducer(
      {
        recommendations: {}
      },
      {
        type: TAGS_RECOMMEND_REQUEST,
        tags: [2, 1, 4],
        creators: ['ib', 'arne']
      }
    );
    expect(
      getRecommendedPids(state, {tags: [2, 1, 4], creators: ['ib', 'arne']})
    ).toMatchSnapshot();
  });
  test('response', () => {
    const state = recommendReducer(
      {
        recommendations: {}
      },
      {
        type: TAGS_RECOMMEND_RESPONSE,
        tags: [2, 1, 4],
        creators: ['ib', 'arne'],
        pids: ['pid1', 'pid2', 'pid3']
      }
    );
    expect(
      getRecommendedPids(state, {tags: [2, 1, 4], creators: ['ib', 'arne']})
    ).toMatchSnapshot();
  });
});
