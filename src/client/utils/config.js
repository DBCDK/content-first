import {get} from 'lodash';

const env = process.env;

/*
  removes the leading REACT_APP_ from environment name
  this ensures that serverside and clientside config
  uses the same environment variable names.
*/

let config = {};
if (env.NODE_ENV === 'development') {
  Object.keys(env).forEach(k => {
    let key = k.replace('REACT_APP_', '');
    return (config[key] = env[k]);
  });
} else {
  config = get(window, 'CONFIG');
}

export default config;
