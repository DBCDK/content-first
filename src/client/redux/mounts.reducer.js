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
        let parent;
        Object.keys(mounts).forEach((key)=> {
          if (mounts[key].type === 'SIMILAR') {
            if (mounts[key].parent === parent) {
              delete mounts[key];
            } else {
              parent = mounts[key].parent;
            }
          }
        });
        return mounts;
      }
      default:
        return state;
    }
  };

export default mountsReducer;
