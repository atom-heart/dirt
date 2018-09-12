import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import { eventReducer } from './reducers/event-reducer.js';
import { stagesReducer } from './reducers/stages-reducer.js';
import { splitsReducer } from './reducers/splits-reducer.js';

const store = createStore(combineReducers({
  event: eventReducer,
  stages: stagesReducer,
  splits: splitsReducer
}), compose(
  applyMiddleware(thunk),
  window.devToolsExtension && window.devToolsExtension()
));

export default store;
