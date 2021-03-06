import {createBrowserHistory} from 'history';
import {createStore, applyMiddleware, compose} from 'redux';
import {initialize} from '../matomo';
import reducer from './root.reducer';
import {historyMiddleware} from './middleware';
import {ON_LOCATION_CHANGE} from './router.reducer';
import Cookies from 'js-cookie';

export default (middleware, initialState) => {
  const trackingApproved = Cookies.get('did-accept-cookies') === 'accepted';
  const history = createBrowserHistory();
  const providedMiddleware = middleware ? middleware : [];
  middleware = [...providedMiddleware, historyMiddleware(history)];

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  // Redux-first routing is used as described:
  // https://medium.freecodecamp.org/an-introduction-to-the-redux-first-routing-model-98926ebf53cb
  // We subscribe to history-changes, making sure path is always synced and stored in global state.
  // In this way we change page by dispatching a HISTORY_PUSH action; historyMiddleware pushes
  // path to history object, and the history listener below dispatches ON_LOCATION_CHANGE, which updates state.
  // The state is then the single source of truth, as we always use the path stored in state when rendering.
  history.listen(location => {
    store.dispatch({
      type: ON_LOCATION_CHANGE,
      path: location.pathname,
      location
    });
  });

  initialize(history, trackingApproved);
  store.dispatch({
    type: ON_LOCATION_CHANGE,
    path: history.location.pathname,
    location: history.location
  });

  if (window.Cypress) {
    window.__store__ = store;
  }

  return store;
};
