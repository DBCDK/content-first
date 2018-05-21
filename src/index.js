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
import {commentMiddleware} from './client/redux/comment.middleware';
<<<<<<< HEAD
import {replayMiddleware} from './client/redux/replay';
import {interactionMiddleware} from './client/redux/interaction.middleware';
=======
import {
  interactionMiddleware,
  logInteractionsMiddleware
} from './client/redux/interaction.middleware';
>>>>>>> adding logging of last 20 user interacttions to show interaction type and pid

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
  commentMiddleware,
<<<<<<< HEAD
  replayMiddleware,
  interactionMiddleware
=======
  interactionMiddleware,
  logInteractionsMiddleware
>>>>>>> adding logging of last 20 user interacttions to show interaction type and pid
]);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
