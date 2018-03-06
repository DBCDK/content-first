const defaultState = {};

export const ADD_COMMENT = 'ADD_COMMENT';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_ERROR = 'ADD_COMMENT_ERROR';
export const TOGGLE_EDIT_COMMENT = 'TOGGLE_EDIT_COMMENT';
export const SAVE_COMMENT = 'SAVE_COMMENT';
export const SAVE_COMMENT_SUCCESS = 'SAVE_COMMENT_SUCCESS';
export const SAVE_COMMENT_ERROR = 'SAVE_COMMENT_ERROR';
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
        [action.id]: updateComment(state, action.id, {
          _id: action.comment._id,
          edit: action.edit
        })
      });
    }
    case SAVE_COMMENT: {
      const list = updateComment(state[action.id], {
        ...action.comment,
        saving: true
      });
      return Object.assign({}, state, {
        [action.id]: {...list, saving: true, error: null}
      });
    }
    case SAVE_COMMENT_SUCCESS: {
      const list = updateComment(state[action.id], {
        ...action.comment,
        saving: false,
        editing: false
      });
      return Object.assign({}, state, {
        [action.id]: {...list, saving: false}
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
          comments: action.comments.reverse(),
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

export const addUserProfilesToComments = (state, comments) => {
  return comments.map(comment => ({
    ...comment,
    user: state.users.has(comment._owner)
      ? state.users.get(comment._owner).toJS()
      : {}
  }));
};

export const getCommentsForId = (state, id) => {
  const {comments = [], loading = true, error, saving} =
    state.comments[id] || {};
  return {
    comments: addUserProfilesToComments(state, comments),
    loading,
    saving,
    error
  };
};
