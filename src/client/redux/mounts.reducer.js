const defaultState = {};

export const UPDATE_MOUNT = 'UPDATE_MOUNT';
export const REMOVE_MOUNT = 'REMOVE_MOUNT';

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

    case REMOVE_MOUNT: {
      const mounts = {...state};
      delete mounts[action.mount];
      return mounts;
    }
    default:
      return state;
  }
};

export default mountsReducer;
