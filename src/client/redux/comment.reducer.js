const defaultState = {};

export const ADD_COMMENT = 'ADD_COMMENT';
export const FETCH_COMMENTS = 'FETCH_COMMENTS';
export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
export const FETCH_COMMENTS_ERROR = 'FETCH_COMMENTS_ERROR';

const commentReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_COMMENT: {
      const group = Object.assign(
        {id: action.id, comments: []},
        state[action.id]
      );
      group.comments = [...group.comments, action.comment];
      return Object.assign({}, state, {[action.id]: group});
    }
    case FETCH_COMMENTS: {
      return Object.assign({}, state, {
        [action.id]: {...state[action.id], loading: true}
      });
    }
    case FETCH_COMMENTS_SUCCESS: {
      return Object.assign({}, state, {
        [action.id]: {id: action.id, comments: action.comments, loading: false}
      });
    }
    case FETCH_COMMENTS_ERROR: {
      return Object.assign({}, state, {
        [action.id]: {loading: false, comments: [], error: action.error}
      });
    }
    default:
      return state;
  }
};

export default commentReducer;
