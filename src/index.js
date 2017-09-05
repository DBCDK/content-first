import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import App from './client/App';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducer from './client/redux/root.reducer';
import {historyMiddleware, loggerMiddleware} from './client/redux/middleware';
import registerServiceWorker from './client/registerServiceWorker';
import {ON_LOCATION_CHANGE} from './client/redux/router.reducer';

const history = createBrowserHistory();
const store = createStore(reducer, applyMiddleware(loggerMiddleware, historyMiddleware(history)));

// Redux-first routing is used as described:
// https://medium.freecodecamp.org/an-introduction-to-the-redux-first-routing-model-98926ebf53cb
// We subscribe to history-changes, making sure path is always synced and stored in global state.
// In this way we change page by dispatching a HISTORY_PUSH action; historyMiddleware pushes
// path to history object, and the history listener below dispatches ON_LOCATION_CHANGE, which updates state.
// The state is then the single source of truth, as we always use the path stored in state when rendering.
store.dispatch({type: ON_LOCATION_CHANGE, path: history.location.pathname});
history.listen((location) => {
  store.dispatch({type: ON_LOCATION_CHANGE, path: location.pathname});
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
