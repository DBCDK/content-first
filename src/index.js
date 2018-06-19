import 'babel-polyfill';
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
import {tasteMiddleware} from './client/redux/taste.middleware';
import {userMiddleware} from './client/redux/user.middleware';
import {usersMiddleware} from './client/redux/users';
import {orderMiddleware} from './client/redux/order.middleware';
import {recommendMiddleware} from './client/redux/recommend';
import {tagIdMiddleware} from './client/redux/tagId';
import {commentMiddleware} from './client/redux/comment.middleware';
import {replayMiddleware} from './client/redux/replay';
import {interactionMiddleware} from './client/redux/interaction.middleware';

const store = createStore([
  userMiddleware,
  usersMiddleware,
  requestMiddleware,
  tasteMiddleware,
  shortListMiddleware,
  listMiddleware,
  searchMiddleware,
  logMiddleware,
  orderMiddleware,
  recommendMiddleware,
  tagIdMiddleware,
  commentMiddleware,
  replayMiddleware,
  interactionMiddleware
]);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
