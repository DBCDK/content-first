const defaultState = {};

export const UPDATE_MOUNT = 'UPDATE_MOUNT';

const mountsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_MOUNT: {
      const mounts = {...state};
      mounts[action.mount] = {
        ...(mounts[action.mount] || {}),
        ...action.data
      };

      return mounts;
    }

    default:
      return state;
  }
};

export default mountsReducer;
