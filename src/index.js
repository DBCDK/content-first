import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './client/App';
// import registerServiceWorker from './client/registerServiceWorker';
import createStore from './client/redux/Store';
import {
  requestMiddleware,
  profileMiddleware,
  shortListMiddleware,
  listMiddleware,
  searchMiddleware,
  orderMiddleware
} from './client/redux/middleware';

const store = createStore([
  requestMiddleware,
  profileMiddleware,
  shortListMiddleware,
  listMiddleware,
  searchMiddleware,
  orderMiddleware
]);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
