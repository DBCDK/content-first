import {get} from 'lodash';

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

          /* Decode Url before detecting values, removes the bug where comma seperated values,
            is shown as %2C*/
          value = decodeURIComponent(value);

          /* Check if value is a range - if true convert to array */
          if (value.includes(',')) {
            value = value.split(',');
          } else {
            value = value.replace(/\+/g, ' ');
          }

          if (!params[key]) {
            params[key] = [];
          }

          params[key].push(value);

          return params;
        }, {})
    : {};
};

const routerReducer = (state = {pos: -1, rootPos: -1, stack: []}, action) => {
  switch (action.type) {
    case ON_LOCATION_CHANGE: {
      const historyPos = get(action, 'location.state.pos', 1);
      const rootPos = state.rootPos === -1 ? historyPos : state.rootPos;
      const pos = historyPos - rootPos;

      let stack = [...state.stack];

      if (pos > stack.length - 1) {
        stack.push(action);
      } else {
        /* eslint-disable no-lonely-if */
        if (
          stack[pos] &&
          JSON.stringify(action.location) !==
            JSON.stringify(stack[pos].location)
        ) {
          stack = stack.slice(0, pos);
          stack.push(action);
        }
        /* eslint-enable no-lonely-if */
      }

      const params = getQueryStringParams(action.location.search);
      return {
        path: action.path,
        hash: action.location.hash,
        params,
        pos,
        stack,
        rootPos
      };
    }
    default:
      return state;
  }
};

export default routerReducer;
