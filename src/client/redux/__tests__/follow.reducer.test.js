import followReducer, {follow, unfollow} from '../follow.reducer';

describe('followReducer', () => {
  test('follow a list', () => {
    let state = followReducer({}, follow('some-id-1', 'list'));
    expect(state).toMatchSnapshot();
  });
  test('unfollow a list', () => {
    let state = followReducer({}, follow('some-id-1', 'list'));
    state = followReducer(state, follow('some-id-2', 'list'));
    expect(state).toMatchSnapshot();
    state = followReducer(state, unfollow('some-id-1', 'follow-id-123'));
    expect(state).toMatchSnapshot();
  });
});
