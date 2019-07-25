import 'core-js';
import 'regenerator-runtime/runtime';
import 'react-app-polyfill/ie9';
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
// import {followMiddleware} from './client/redux/follow.middleware';
import {userMiddleware} from './client/redux/user.middleware';
import {usersMiddleware} from './client/redux/users';
import {orderMiddleware} from './client/redux/order.middleware';
import {recommendMiddleware} from './client/redux/recommend';
import {commentMiddleware} from './client/redux/comment.middleware';
import {replayMiddleware} from './client/redux/replay';
import {interactionMiddleware} from './client/redux/interaction.middleware';
import {beltsMiddleware} from './client/redux/belts.middleware';
import {statsMiddleware} from './client/redux/stats.middleware';
import {matomoMiddleware} from './client/redux/matomo.middleware';
import openplatform from 'openplatform';

// for window.scroll() back compatibility
smoothscroll.polyfill();

const store = createStore([
  userMiddleware,
  usersMiddleware,
  requestMiddleware,
  shortListMiddleware,
  listMiddleware,
  // followMiddleware,
  logMiddleware,
  orderMiddleware,
  recommendMiddleware,
  commentMiddleware,
  replayMiddleware,
  interactionMiddleware,
  beltsMiddleware,
  statsMiddleware,
  matomoMiddleware
]);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();

// Overwrite specific openplatform methods, to make stubbing possible for testing purposes
if (window.Cypress && window.__stubbed_openplatform__) {
  Object.assign(openplatform, window.__stubbed_openplatform__);
}
