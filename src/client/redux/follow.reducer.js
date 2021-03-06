const defaultState = {};

export const FOLLOW = 'FOLLOW';
export const UNFOLLOW = 'UNFOLLOW';
export const FOLLOWS_LOAD_REQUEST = 'FOLLOW_LOAD_REQUEST';
export const FOLLOWS_LOAD_RESPONSE = 'FOLLOW_LOAD_RESPONSE';
export const FOLLOW_LOAD_REQUEST = 'FOLLOW_LOAD_REQUEST';
export const FOLLOW_LOAD_RESPONSE = 'FOLLOW_LOAD_RESPONSE';
export const FOLLOW_ERROR = 'FOLLOW_ERROR';

const followReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FOLLOWS_LOAD_REQUEST: {
      return Object.assign({}, state, {loaded: false, loading: true});
    }
    case FOLLOWS_LOAD_RESPONSE: {
      let obj = {};
      action.data.forEach(el => {
        obj[el.id] = el;
      });
      return Object.assign({}, state, obj, {loaded: true, loading: false});
    }
    case FOLLOW_LOAD_REQUEST: {
      let newState = {...state};
      if (action._id) {
        newState[action._id] = {loading: true, loaded: false};
      }
      return newState;
    }

    case FOLLOW_LOAD_RESPONSE: {
      let obj = {};
      action.data.forEach(el => {
        obj[el.id] = el;
      });
      return Object.assign({}, state, obj);
    }

    case FOLLOW_ERROR: {
      return Object.assign({}, state, {
        error: action.error,
        loaded: false,
        loading: false
      });
    }

    case FOLLOW: {
      if (!action.id) {
        throw new Error('Cant follow when no id is set');
      }
      if (!action.cat) {
        throw new Error('Cant follow when no follow category ´cat´ is set');
      }
      let obj = state;
      obj[action.id] = action;
      obj[action.id].type = 'follows';
      return Object.assign({}, state, obj);
    }

    case UNFOLLOW: {
      if (!action.id) {
        throw new Error("'id' is missing from action");
      }
      let obj = state;
      delete obj[action.id];
      return Object.assign({}, state, obj);
    }
    default:
      return state;
  }
};

// ACTION CREATORS
export const follow = (
  id,
  cat,
  _created = Math.round(new Date().getTime() / 1000)
) => {
  return {
    type: FOLLOW,
    id,
    cat,
    _created
  };
};
export const unfollow = id => {
  return {
    type: UNFOLLOW,
    id
  };
};

export default followReducer;
