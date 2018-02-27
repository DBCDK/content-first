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
import {orderMiddleware} from './client/redux/order.middleware';
import {recommendMiddleware} from './client/redux/recommend';

const store = createStore([
  userMiddleware,
  requestMiddleware,
  tasteMiddleware,
  shortListMiddleware,
  listMiddleware,
  searchMiddleware,
  logMiddleware,
  orderMiddleware,
  recommendMiddleware
]);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
