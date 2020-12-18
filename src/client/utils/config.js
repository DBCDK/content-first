import {get} from 'lodash';
const env = process.env;

/*
  removes the leading REACT_APP_ from environment name
  this ensures that serverside and clientside config
  uses the same environment variable names.
*/

let config = get(window, 'CONFIG') || {};
if (env.NODE_ENV === 'development') {
  Object.keys(env).forEach(k => {
    let key = k.replace('REACT_APP_', '');
    return (config[key] = env[k]);
  });
} else {
  // quick fix
  config.MATOMO_URL = get(config, 'matomo.url');
  config.MATOMO_SITE_ID = get(config, 'matomo.siteId');
  config.MATOMO_DATA_SITE_ID = get(config, 'matomo.dataSiteId');
  config.MATOMO_AID = get(config, 'matomo.aid');

  config.KIOSK_ENABLED = get(config, 'kiosk.enabled');
}

export default config;
