import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/layout.css';

import Event from './components/Event';
import store from './store.js';

ReactDOM.render(
  (<Provider store={store}>
    <Event />
  </Provider>),
  document.getElementById('root')
);
