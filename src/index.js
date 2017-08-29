import React from 'react';
import ReactDOM from 'react-dom';
import './client/style/index.css';
import App from './client/App';
import registerServiceWorker from './client/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
