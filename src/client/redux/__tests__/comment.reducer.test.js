import commentReducer, {
  FETCH_COMMENTS,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_ERROR
} from '../comment.reducer';

const createTestState = () => ({
  expanded: false,
  elements: [],
  isLoading: false,
  pendingMerge: null
});

describe('commentReducer', () => {
  test('Fetch comments', () => {
    const state = createTestState();
    const action = {
      type: FETCH_COMMENTS,
      id: '123'
    };
    const result = commentReducer(state, action);
    expect(result).toMatchSnapshot();
  });
  test('Fetch comments success', () => {
    const state = createTestState();
    const action = {
      type: FETCH_COMMENTS_SUCCESS,
      id: '123',
      comments: [{id: 'comment_1'}]
    };
    const result = commentReducer(state, action);
    expect(result).toMatchSnapshot();
  });
  test('Fetch comments error', () => {
    const state = createTestState();
    const action = {
      type: FETCH_COMMENTS_ERROR,
      id: '123',
      error: 'some error'
    };
    const result = commentReducer(state, action);
    expect(result).toMatchSnapshot();
  });
});
