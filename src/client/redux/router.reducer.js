export const HISTORY_PUSH = 'HISTORY_PUSH';
export const HISTORY_PUSH_FORCE_REFRESH = 'HISTORY_PUSH_FORCE_REFRESH';
export const HISTORY_REPLACE = 'HISTORY_REPLACE';
export const ON_LOCATION_CHANGE = 'ON_LOCATION_CHANGE';

const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          let [key, value] = param.split('=');

          /* Check if value is a range - if true convert to array */
          if (value.includes(',')) {
            value = value.split(',');
            value = [value[0], value[1]];
          } else {
            value = decodeURIComponent(value.replace(/\+/g, ' '));
          }

          if (!params[key]) {
            params[key] = [];
          }

          params[key].push(value);

          return params;
        }, {})
    : {};
};

const routerReducer = (state = {}, action) => {
  switch (action.type) {
    case ON_LOCATION_CHANGE: {
      let regexResult;

      const params = getQueryStringParams(action.location.search);

      return {path: action.path, params};
    }
    default:
      return state;
  }
};

export default routerReducer;
