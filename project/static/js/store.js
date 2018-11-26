import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import { eventReducer } from './reducers/event-reducer.js';
import { formsReducer } from './reducers/forms-reducer.js';

const store = createStore(combineReducers({
  event: eventReducer,
  forms: formsReducer
}), compose(
  applyMiddleware(thunk),
  window.devToolsExtension && window.devToolsExtension()
));

export default store;
