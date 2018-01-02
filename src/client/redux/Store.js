import {createBrowserHistory} from 'history';
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './root.reducer';
import {historyMiddleware} from './middleware';
import {ON_LOCATION_CHANGE} from './router.reducer';

export default middleware => {
  const history = createBrowserHistory();
  const providedMiddleware = middleware ? middleware : [];
  middleware = [...providedMiddleware, historyMiddleware(history)];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)));

  // Redux-first routing is used as described:
  // https://medium.freecodecamp.org/an-introduction-to-the-redux-first-routing-model-98926ebf53cb
  // We subscribe to history-changes, making sure path is always synced and stored in global state.
  // In this way we change page by dispatching a HISTORY_PUSH action; historyMiddleware pushes
  // path to history object, and the history listener below dispatches ON_LOCATION_CHANGE, which updates state.
  // The state is then the single source of truth, as we always use the path stored in state when rendering.
  store.dispatch({
    type: ON_LOCATION_CHANGE,
    path: history.location.pathname,
    location: history.location
  });
  history.listen(location => {
    store.dispatch({
      type: ON_LOCATION_CHANGE,
      path: location.pathname,
      location
    });
  });

  return store;
};
