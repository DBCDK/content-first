import React from 'react';
import ReactDOM from 'react-dom';
import './client/style/index.css';
import App from './client/App';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './client/reducers/root';
import registerServiceWorker from './client/registerServiceWorker';

const store = createStore(reducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
