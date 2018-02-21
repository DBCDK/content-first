const defaultState = {};

export const ADD_COMMENT = 'ADD_COMMENT';
// export const REMOVE_COMMENT = 'REMOVE_COMMENT';
// export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const FETCH_COMMENTS = 'FETCH_COMMENTS';
export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
export const FETCH_COMMENTS_ERROR = 'FETCH_COMMENTS_ERROR';
// export const FETCH_COMMENT_WITH_ID = 'FETCH_COMMENT_WITH_ID';

const commentReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_COMMENT: {
      const group = Object.assign(
        {id: action.id, public: true, comments: []},
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
        [action.id]: {comments: action.comments, loading: false}
      });
    }
    default:
      return state;
  }
};

export default commentReducer;
