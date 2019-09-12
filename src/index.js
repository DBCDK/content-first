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
import {hotjarMiddleware} from './client/redux/hotjar.middleware';
import openplatform from 'openplatform';
import request from 'superagent';

// for window.scroll() back compatibility
smoothscroll.polyfill();
(async () => {
  let initialState = {};
  try {
    initialState = (await request.get('/v1/initial-state')).body.data;
  } catch (e) {
    console.error('could not fetch initial state', e);
  }

  const store = createStore(
    [
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
      matomoMiddleware,
      hotjarMiddleware
    ],
    initialState
  );

  // TODO hent initialstate ud af et endpoint, fordi det gør det nemmere i forhold til CRA
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
})();

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
