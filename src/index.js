import 'babel-polyfill';
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
  searchMiddleware,
  logMiddleware
} from './client/redux/middleware';
import {followMiddleware} from './client/redux/follow.middleware';
import {tasteMiddleware} from './client/redux/taste.middleware';
import {userMiddleware} from './client/redux/user.middleware';
import {usersMiddleware} from './client/redux/users';
import {orderMiddleware} from './client/redux/order.middleware';
import {recommendMiddleware} from './client/redux/recommend';
import {commentMiddleware} from './client/redux/comment.middleware';
import {replayMiddleware} from './client/redux/replay';
import {interactionMiddleware} from './client/redux/interaction.middleware';
import {beltsMiddleware} from './client/redux/belts.middleware';
import {statsMiddleware} from './client/redux/stats.middleware';

// for window.scroll() back compatibility
smoothscroll.polyfill();


const store = createStore([
  userMiddleware,
  usersMiddleware,
  requestMiddleware,
  tasteMiddleware,
  shortListMiddleware,
  listMiddleware,
  followMiddleware,
  searchMiddleware,
  logMiddleware,
  orderMiddleware,
  recommendMiddleware,
  commentMiddleware,
  replayMiddleware,
  interactionMiddleware,
  beltsMiddleware,
  statsMiddleware
]);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
