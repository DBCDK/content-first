export const HISTORY_PUSH = 'HISTORY_PUSH';
export const HISTORY_PUSH_FORCE_REFRESH = 'HISTORY_PUSH_FORCE_REFRESH';
export const HISTORY_REPLACE = 'HISTORY_REPLACE';
export const ON_LOCATION_CHANGE = 'ON_LOCATION_CHANGE';

const PARAMS_REGEX = /[?&](\w*)=(.\w*)/g;
const routerReducer = (state = {}, action) => {
  switch (action.type) {
    case ON_LOCATION_CHANGE: {
      const params = {};
      let regexResult;
      // eslint-disable-next-line
      while (
        (regexResult = PARAMS_REGEX.exec(action.location.search)) !== null
      ) {
        const key = regexResult[1];
        const value = regexResult[2];
        if (!params[key]) {
          params[key] = [];
        }
        params[key].push(value);
      }
      return {path: action.path, params};
    }
    default:
      return state;
  }
};

export default routerReducer;
