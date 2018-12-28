import {createSelector} from 'reselect';

const defaultState = {};

export const ADD_COMMENT = 'ADD_COMMENT';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_ERROR = 'ADD_COMMENT_ERROR';
export const TOGGLE_EDIT_COMMENT = 'TOGGLE_EDIT_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS';
export const UPDATE_COMMENT_ERROR = 'UPDATE_COMMENT_ERROR';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_ERROR = 'DELETE_COMMENT_ERROR';
export const FETCH_COMMENTS = 'FETCH_COMMENTS';
export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
export const FETCH_COMMENTS_ERROR = 'FETCH_COMMENTS_ERROR';

function updateComment(list, data) {
  const comments = list.comments.map(comment => {
    if (comment._id === data._id) {
      return {...comment, ...data};
    }
    return comment;
  });
  return {...list, comments};
}

const commentReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_COMMENT: {
      const group = Object.assign(
        {id: action.id, comments: []},
        state[action.id],
        {error: null, saving: true}
      );
      group.comments = [
        ...group.comments,
        {
          comment: action.comment,
          saving: true,
          _id: 'new_comment',
          _owner: action.owner
        }
      ];
      return Object.assign({}, state, {[action.id]: group});
    }
    case ADD_COMMENT_SUCCESS: {
      const group = Object.assign(
        {id: action.id, comments: []},
        state[action.id],
        {saving: false}
      );
      group.comments = group.comments.map(
        el =>
          el._id === 'new_comment' ? {...el, ...action.data, saving: false} : el
      );
      return Object.assign({}, state, {[action.id]: group});
    }
    case ADD_COMMENT_ERROR: {
      const group = Object.assign(
        {id: action.id, comments: []},
        state[action.id],
        {saving: false}
      );
      group.comments = group.comments.filter(el => el._id !== 'new_comment');
      group.error = {
        error: 'Kommentaren kunne ikke gemmes',
        comment: action.comment
      };

      return Object.assign({}, state, {[action.id]: group});
    }

    case TOGGLE_EDIT_COMMENT: {
      return Object.assign({}, state, {
        [action.comment._key]: updateComment(state[action.comment._key], {
          _id: action.comment._id,
          editing: action.editing,
          error: null
        })
      });
    }
    case DELETE_COMMENT:
    case UPDATE_COMMENT: {
      const list = updateComment(state[action.comment._key], {
        ...action.comment,
        saving: true,
        error: null
      });
      return Object.assign({}, state, {
        [action.comment._key]: list
      });
    }
    case UPDATE_COMMENT_SUCCESS: {
      const list = updateComment(state[action.comment._key], {
        ...action.comment,
        saving: false,
        editing: false
      });
      return Object.assign({}, state, {
        [action.comment._key]: list
      });
    }
    case UPDATE_COMMENT_ERROR: {
      const list = updateComment(state[action.comment._key], {
        ...action.comment,
        saving: false,
        editing: true,
        error: {
          error: 'Det var ikke muligt at opdatere kommentaren',
          comment: action.comment.comment
        }
      });
      return Object.assign({}, state, {
        [action.comment._key]: {...list, saving: false}
      });
    }

    case DELETE_COMMENT_ERROR: {
      const list = updateComment(state[action.comment._key], {
        ...action.comment,
        saving: false,
        editing: true,
        error: {
          error: 'Det var ikke muligt at slette kommentaren',
          comment: action.comment.comment
        }
      });
      return Object.assign({}, state, {
        [action.comment._key]: {...list, saving: false}
      });
    }

    case DELETE_COMMENT_SUCCESS: {
      const list = state[action.comment._key];
      const comments = list.comments.filter(
        comment => comment._id !== action.comment._id
      );
      return Object.assign({}, state, {
        [action.comment._key]: {...list, comments}
      });
    }

    case FETCH_COMMENTS: {
      return Object.assign({}, state, {
        [action.id]: {...state[action.id], loading: true}
      });
    }
    case FETCH_COMMENTS_SUCCESS: {
      return Object.assign({}, state, {
        [action.id]: {
          id: action.id,
          comments: action.comments.sort((a, b) => a._created - b._created),
          loading: false
        }
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

export const addUserProfilesToComments = (users, comments) => {
  return comments.map(comment => ({
    ...comment,
    user: users.has(comment._owner) ? users.get(comment._owner).toJS() : {}
  }));
};

export const getCommentsForIdSelector = () =>
  createSelector(
    [(state, {id}) => state.comments[id], state => state.users],
    (c, users) => {
      const {comments = [], loading = true, error, saving} = c || {};
      return {
        comments: addUserProfilesToComments(users, comments),
        loading,
        saving,
        error
      };
    }
  );
