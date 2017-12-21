export const ON_LOCATION_CHANGE = 'ON_LOCATION_CHANGE';

const PARAMS_REGEX = /[?&](\w*)=(\w*)/g;
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
