import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'resize-observer-polyfill/dist/ResizeObserver.global';
import smoothscroll from 'smoothscroll-polyfill';
import './prototypes';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './client/App';
import createStore from './client/redux/Store';
import {
  requestMiddleware,
  shortListMiddleware,
  listMiddleware,
  logMiddleware
} from './client/redux/middleware';
import thunk from 'redux-thunk';
import {userMiddleware} from './client/redux/user.middleware';
import {usersMiddleware} from './client/redux/users';
import {orderMiddleware} from './client/redux/order.middleware';
import {commentMiddleware} from './client/redux/comment.middleware';
import {replayMiddleware} from './client/redux/replay';
import {interactionMiddleware} from './client/redux/interaction.middleware';
import {beltsMiddleware} from './client/redux/belts.middleware';
import {statsMiddleware} from './client/redux/stats.middleware';
import {matomoMiddleware} from './client/redux/matomo.middleware';
import {hotjarMiddleware} from './client/redux/hotjar.middleware';
import loadInitialState from './client/utils/loadInitialState';
import openplatform from 'openplatform';

import StorageClient from './shared/client-side-storage.client';
import ListRequester from './shared/list.requester';

// Lib imports
import './client/lib/waves-effect.js';
const storageClient = new StorageClient();
const listRequester = new ListRequester({storageClient});
// for window.scroll() back compatibility
smoothscroll.polyfill();

const store = createStore(
  [
    // Used for performance debugging
    // s => next => action => {
    //   var t0 = performance.now();
    //   let result = next(action);
    //   var t1 = performance.now();
    //   console.log(`${action.type}`, action, t1 - t0);
    //   return result;
    // },
    thunk.withExtraArgument({storageClient, listRequester}),
    userMiddleware,
    usersMiddleware,
    requestMiddleware,
    shortListMiddleware,
    listMiddleware,
    logMiddleware,
    orderMiddleware,
    commentMiddleware,
    replayMiddleware,
    interactionMiddleware,
    beltsMiddleware,
    statsMiddleware,
    matomoMiddleware,
    hotjarMiddleware
  ],
  {}
);

loadInitialState(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();

// Overwrite specific openplatform methods, to make stubbing possible for testing purposes
if (window.Cypress && window.__stubbed_openplatform__) {
  window.__stubbed_openplatform__._work = openplatform.work;
  window.__stubbed_openplatform__._libraries = openplatform.libraries;
  window.__stubbed_openplatform__._order = openplatform.order;
  window.__stubbed_openplatform__._connect = openplatform.connect;
  window.__stubbed_openplatform__._disconnect = openplatform.disconnect;
  window.__stubbed_openplatform__._connected = openplatform.connected;
  window.__stubbed_openplatform__._availability = openplatform.availability;
  window.__stubbed_openplatform__._infomedia = openplatform.infomedia;
  window.__stubbed_openplatform__._user = openplatform.user;
  window.__stubbed_openplatform__._wait = ms => {
    return new Promise(r => setTimeout(r, ms));
  };

  Object.assign(openplatform, window.__stubbed_openplatform__);
}
