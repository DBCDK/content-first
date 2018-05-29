const defaultState = {};

export const FOLLOW_LOAD_REQUEST = 'FOLLOW_LOAD_REQUEST';
export const FOLLOW_LOAD_RESPONSE = 'FOLLOW_LOAD_RESPONSE';
export const FOLLOW = 'FOLLOW';
export const UNFOLLOW = 'UNFOLLOW';

const followReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FOLLOW_LOAD_RESPONSE: {
      let obj = {};
      action.data.forEach(el => {
        obj[el.id] = el;
      });

      return Object.assign({}, state, obj);
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
      if (!action._id) {
        throw new Error('Cant unfollow when no _id (obj id) is set');
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
export const follow = (id, cat) => {
  return {
    type: FOLLOW,
    id,
    cat
  };
};
export const unfollow = (id, _id) => {
  return {
    type: UNFOLLOW,
    id,
    _id
  };
};

export default followReducer;
