import Immutable from 'immutable';

import commentReducer, {
  FETCH_COMMENTS,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_ERROR,
  getCommentsForId
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
  describe('Comment selectors', () => {
    test('getCommentsForId', () => {
      const state = {
        commentReducer: {
          id_with_comments: {
            comments: [
              {_owner: 'owner_1', comment: 'comment 1'},
              {_owner: 'owner_2', comment: 'comment 2'}
            ]
          },
          id_loading: {
            loading: true,
            comments: []
          },
          id_error: {
            loading: false,
            comments: [],
            error: {
              comment: 'some comment',
              error: 'some fail'
            }
          }
        },
        users: Immutable.fromJS({
          owner_1: {name: 'name owner 1'}
        })
      };
      expect(getCommentsForId(state, 'unknow_id')).toMatchSnapshot();
      expect(getCommentsForId(state, 'id_with_comments')).toMatchSnapshot();
      expect(getCommentsForId(state, 'id_loading')).toMatchSnapshot();
      expect(getCommentsForId(state, 'id_error')).toMatchSnapshot();
    });
  });
});
